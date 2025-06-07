const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('../database');
const authenticateToken = require('../middleware/auth')
require('dotenv').config();
const axios = require('axios'); //Requires Axios to perform an API request to PayPal's API


/*The method uses authenticate token to check if the token is valid. In case it is, the user makes a query
* The returned orders depend on whether the user role is 'admin' or 'buyer'.
* For the admin it returns all the orders from all users
* Otherwise, it returns the orders for that specific user.
* */
router.get('/orders',authenticateToken, async (req,res) =>{

    //First, it will be checked whether the request comes from a user or an admin
    const {id, role} = req.user;

    let result;
    //If the role is admin, returns the orders from all users.
    /* The query returns the order_id, the creation time, the status, the paypal order code, the delivery address, billing address
    * and the quantity of pellets and the quantity of logs.*/
    try{
        if(role === 'admin'){
            result = await database.query(
                'SELECT o.id AS order_id,o.created_at,o.price,o.status,o.paypal_order_id,o.delivery_address,o.billing_address, u.name, \n' +
                'MAX(CASE WHEN oi.product_id = 1 THEN oi.quantity ELSE 0 END) AS pellets,\n' +
                'MAX(CASE WHEN oi.product_id = 2 THEN oi.quantity ELSE 0 END) AS logs\n' +
                'FROM tfg.orders o\n' +
                'JOIN tfg.users u ON u.id = o.user_id\n' +
                'JOIN tfg.order_items oi ON o.id = oi.order_id\n'+
                'GROUP BY o.id, o.created_at, o.price, o.status, o.paypal_order_id, o.delivery_address, o.billing_address, u.name\n' +
                'ORDER BY o.created_at DESC;'

        );
            /*Same as the previous, but just for the user.*/
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
        res.status(200).json(result.rows); //STATUS CODE 200. RETURNS THE RESULT IN THE BODY
    }catch (error){
        res.status(500).json({ error: 'Error fetching your orders' }); //STATUS CODE 500, ERROR
    }
});
/*To create the order, it will be necessary the PayPal order id provided by the frontend. However, the result of PayPal's operation will
* also be checked in the backend, for security. This is achieved by making a request to the PayPal RESTapi.
* Similarly as in this middleware, to make a request to such API, it is necessary to have an access code. This access code is assembled by means
* of PAYPAL_CLIENT_ID and PAYPAL_SECRET. Both are defined in the .env. To get the code it is called the getPaypalAccessToken() method. Implemented below.
* If the payment is compleated, the method checks if there are enough items among other security steps. Finally it is created the order. See more below.   */
router.post('/orders', authenticateToken, async (req, res) => {


    const { paypalOrderId, items, price, deliveryAddress, billingAddress } = req.body //Retrieve from the req.body
    const userId = req.user.id //Retrieve the user_id attached my the middleware.

    if (!paypalOrderId || !items?.length || !price || !deliveryAddress || !billingAddress) {
        return res.status(400).json({ error: 'Missing order data' }) //If anything is missing, STATUS CODE 400. Missing Data
    }

    //Checks if this paypal_order_id already exists.
    const orderExists = await database.query('SELECT paypal_order_id FROM tfg.orders WHERE paypal_order_id = $1', [paypalOrderId])
    if (orderExists.rows.length > 0){
        return res.status(409).json({ error: 'This paypal_order_id is already in use.' }) // STATUS CODE 409, already exists.
    }
    try { //Get PayPal's access token to make the api request to the PayPal's API.
        const accessToken = await getPaypalAccessToken()
        const paypalRes = await axios.get(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${paypalOrderId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        const paypalStatus = paypalRes.data.status

        //If the status is not COMPLETED, return error
        if (paypalStatus !== 'COMPLETED') { //If it is completed, the payment is not complete and returns STATUS CODE 402, payment unachieved.
            return res.status(402).json({ error: 'Payment not completed in PayPal' })
        }

        let calculatedTotal = 0

        for (const item of items) { //For each of the items in the api it checks there is enough items on stock and calculates its price.
            const productResult = await database.query('SELECT price, stock FROM tfg.products WHERE id = $1', [item.id])
            const product = productResult.rows[0]

            if (!product || product.stock < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for product ID ${item.id}` })
            }

            calculatedTotal += product.price * item.quantity //The price of the item is appended.
        }
        const parsedPrice = parseFloat(price) //Parses the price cost in the req.body to Float.

        if (parseFloat(calculatedTotal) !== parseFloat(parsedPrice.toFixed(2))) { //Compares the paid price that should be paid.
            return res.status(400).json({ error: 'Total price mismatch. Order not created.' }) //If they do not match, STATUS CODE 400. Price mismatch.
        }

        //Adds the order on the database.
        const orderRes = await database.query( // Adds a
            `INSERT INTO tfg.orders 
       (user_id, price, status, paypal_order_id, delivery_address, billing_address, created_at)
       VALUES ($1, $2, 'Delivered', $3, $4, $5, NOW())
       RETURNING id`,
            [userId, price, paypalOrderId, deliveryAddress, billingAddress]
        )

        //With the returned id's from the DB, which is the PK, are now added the item/s to the ordeR_items table.
        //Those use the orders PK as FK. along with the produce_id (PK of products, FK of products on order_items), and the quantity bought.
        const orderId = orderRes.rows[0].id

        for (const item of items) {
            await database.query(
                'INSERT INTO tfg.order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)',
                [orderId, item.id, item.quantity]
            )
            //The stock is updated
            await database.query(
                'UPDATE tfg.products SET stock = stock - $1 WHERE id = $2',
                [item.quantity, item.id]
            )
        }

        res.status(201).json({ message: 'Order created successfully', orderId })// STATUS CODE 201, SUCCESS

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' }) //STATUS CODE 500
   }

})

/*The function assembles PayPal's access token using the PAYPAL_CLIENT_ID and the PAYPAL_SECRET (DEFINED IN .ENV) */
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