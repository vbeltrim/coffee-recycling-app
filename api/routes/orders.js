const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('../database');
const authenticateToken = require('../middleware/auth')
require('dotenv').config();
const axios = require('axios');

router.get('/orders',authenticateToken, async (req,res) =>{

    //First it will be checked whether the request comes from a user or an admin
    const {id, role} = req.user;
    //-> userId = req.user.id
    //-> role = req.user.role
    let result;
    try{
        if(role === 'admin'){
            result = await database.query(
                'SELECT o.id AS order_id,o.created_at,o.price,o.status,o.paypal_order_id,o.delivery_address,o.billing_address,\n' +
                'MAX(CASE WHEN oi.product_id = 1 THEN oi.quantity ELSE 0 END) AS pellets,\n' +
                'MAX(CASE WHEN oi.product_id = 2 THEN oi.quantity ELSE 0 END) AS logs\n' +
                'FROM tfg.orders o\n' +
                'JOIN tfg.order_items oi ON o.id = oi.order_id\n'+
                'GROUP BY o.id, o.created_at, o.price, o.status, o.paypal_order_id, o.delivery_address, o.billing_address\n' +
                'ORDER BY o.created_at DESC;'

        );
        }else{ //The req comes from a user
            result = await database.query( //This way i get all the orders + the products contained in the order which are in the table order_items
                'SELECT o.id AS order_id,o.created_at,o.price,o.status,o.paypal_order_id,o.delivery_address,o.billing_address,\n' +
                'MAX(CASE WHEN oi.product_id = 1 THEN oi.quantity ELSE 0 END) AS pellets,\n' +
                'MAX(CASE WHEN oi.product_id = 2 THEN oi.quantity ELSE 0 END) AS logs\n' +
                'FROM tfg.orders o\n' +
                'JOIN tfg.order_items oi ON o.id = oi.order_id\n' +
                'WHERE o.user_id = $1\n' +
                'GROUP BY o.id, o.created_at, o.price, o.status, o.paypal_order_id, o.delivery_address, o.billing_address\n' +
                'ORDER BY o.created_at DESC;',[id]
            );
        }
        res.status(200).json(result.rows);
    }catch (error){
        res.status(500).json({ error: 'Error fetching your orders' });
    }
});

//in order to create an order, it should be checked if there is enough stock. And if the payment when well.


router.post('/orders', authenticateToken, async (req, res) => {
    const { paypalOrderId, items, price, deliveryAddress, billingAddress } = req.body
    const userId = req.user.id
    if (!paypalOrderId || !items?.length || !price || !deliveryAddress || !billingAddress) {
        return res.status(400).json({ error: 'Missing order data' })
    }
    try {
        const accessToken = await getPaypalAccessToken()
        const paypalRes = await axios.get(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${paypalOrderId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        const paypalStatus = paypalRes.data.status


        if (paypalStatus !== 'COMPLETED') {
            return res.status(403).json({ error: 'Payment not completed in PayPal' })
        }

        let calculatedTotal = 0

        for (const item of items) {
            const productResult = await database.query('SELECT price, stock FROM tfg.products WHERE id = $1', [item.id])
            const product = productResult.rows[0]

            if (!product || product.stock < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for product ID ${item.id}` })
            }

            calculatedTotal += product.price * item.quantity
        }
        const parsedPrice = parseFloat(price)

        if (parseFloat(calculatedTotal) !== parseFloat(parsedPrice.toFixed(2))) {
            return res.status(400).json({ error: 'Total price mismatch. Order not created.' })
        }

        const orderRes = await database.query(
            `INSERT INTO tfg.orders 
       (user_id, price, status, paypal_order_id, delivery_address, billing_address, created_at)
       VALUES ($1, $2, 'Paid', $3, $4, $5, NOW())
       RETURNING id`,
            [userId, price, paypalOrderId, deliveryAddress, billingAddress]
        )

        const orderId = orderRes.rows[0].id

        for (const item of items) {
            await database.query(
                'INSERT INTO tfg.order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)',
                [orderId, item.id, item.quantity]
            )

            await database.query(
                'UPDATE tfg.products SET stock = stock - $1 WHERE id = $2',
                [item.quantity, item.id]
            )
        }

        res.status(201).json({ message: 'Order created successfully', orderId })

    } catch (error) {
        console.error('Order creation error:', error)
        res.status(500).json({ error: 'Internal server error' })
   }
    res.status(201).json({ message: 'Order created successfully'})


})


async function getPaypalAccessToken() {
    const clientId = process.env.PAYPAL_CLIENT_ID
    const secret = process.env.PAYPAL_SECRET


    const credentials = Buffer.from(`${clientId}:${secret}`).toString('base64')

    const response = await axios.post(
        'https://api-m.sandbox.paypal.com/v1/oauth2/token',
        'grant_type=client_credentials',
        {
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }
    )

    return response.data.access_token
}


module.exports = router;