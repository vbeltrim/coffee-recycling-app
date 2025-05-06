const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('../database');
const authenticateToken = require('../middleware/auth')
require('dotenv').config();

router.get('/',authenticateToken, async (req,res) =>{

    //First it will be checked whether the request comes from a user or an admin
    const { id: user_id, role} = req.user;
    //-> userId = req.user.id
    //-> role = req.user.role
    let result;
    try{
        if(role === 'admin'){ //The req comes from an admin
            result = await database.query(
                'SELECT \n' +
                '  o.*, \n' +
                '  i.pellets, \n' +
                '  i.logs\n' +
                'FROM tfg.orders o\n' +
                'JOIN tfg.order_items i ON o.id = i.order_id;'
            );
        }else{ //The req comes from a user
            result = await database.query( //This way i get all the orders + the products contained in the order which are in the table order_items
                'SELECT \n' +
                '  o.*, \n' +
                '  i.pellets, \n' +
                '  i.logs\n' +
                'FROM tfg.orders o\n' +
                'JOIN tfg.order_items i ON o.id = i.order_id\n' +
                'WHERE o.user_id = $1\n' +
                'ORDER BY o.created_at DESC;',[user_id]
            );
        }
        res.status(200).json(
            {
                orders : result.rows
            }
        );
    }catch (error){
        res.status(500).json({ error: 'Error fetching your orders' });
    }
});

//in order to create a post order, it should be checked if there is enough stock. And if the payment when well.
router.post('/',authenticateToken, async  (req, res)=>{
    const { items, deliveryAddress, billAddress, paymentId } = req.body;

    //Contrastar que el payload contingue items.
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'No items provided' });
    }
    if (!deliveryAddress || !billAddress) {
        return res.status(400).json({ message: 'Delivery and billing addresses are required' });
    }
    //De moment serà un fake payment id
    if (!paymentId || paymentId.trim() === '') {
        return res.status(400).json({ message: 'Payment ID missing. Payment must be completed first.' });
    }
    try {
        let totalPrice = 0;
        for (const item of items) {
            //first we check each of the items exist
            const exists = await Product.productExists(item.productId);
            if (!exists) {
                return res.status(404).json({message: `Product ID ${item.productId} not found.`});
            }
            //Control the stock.
            const stock = await Product.checkStock(item.productId);
            if (stock < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for product ID ${item.productId}. Available: ${stock}`
                });
            }
            //Update the total price.
            const price = await Product.getPrice(item.productId);
            totalPrice += price * item.quantity;

        }
        //Now we have to create the order.
        const [orderResult] = await db.execute(
            `INSERT INTO orders (user_id, price, status, creationDate, deliveryAddress, billingAddress)
            VALUES (?, ?, ?, NOW(), ?, ?)`,
            [req.user.id, totalPrice, 'paid', deliveryAddress, billAddress]
        );

        //Get the return orderId, which was automatically created.
        const orderId = orderResult.insertId;

        for (const item of items) {
            //Adds the items on the order_items table
            await db.execute(`INSERT INTO order_items (order_id, product_id, amount) VALUES (?, ?, ?)`,
                [orderId, item.productId, item.quantity]
            );
            //Reduces the stock in each Product
            await Product.reduceStock(item.productId, item.quantity);
        }
        res.status(201).json({ message: 'Order placed successfully.', orderId });

    }catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'There has been an error creating the order' });
    }
})
module.exports = router;