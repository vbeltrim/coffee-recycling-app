const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require("../middleware/auth");


/*This endpoint inserts a review on the database. There are though certain rules that have to be met.
* 1- The user must have bought the product
* 2- The user must not have reviewed the product
* 3- */
router.post('/review', authenticateToken, async (req, res) => {
    const { order_id, product_id, description, star_rating } = req.body;
    const user_id = req.user.id;

    //check these fields are not missing
    if (!order_id || !product_id || !description || !star_rating) {
        return res.status(400).json({ message: 'Missing fields in request' });
    }
    try { //check that the product has actually been bought
        const purchaseCheck = await db.query(
            `SELECT 1
            FROM tfg.orders o
            JOIN tfg.order_items oi ON o.id = oi.order_id
            WHERE o.user_id = $1 AND oi.product_id = $2 AND o.status = 'Delivered'`,
            [user_id, product_id]
        );

        if (purchaseCheck.rows.length === 0) { //If the product has not been delivered yet, then it returns a STATUS CODE 400. ERROR
            return res.status(400).json({ message: 'You can only review products from delivered orders' });
        }

        // Check for an existing review to check if a user has already reviewed such product.
        const existing = await db.query(
            'SELECT 1 FROM tfg.reviews WHERE user_id = $1 AND product_id = $2',
            [user_id, product_id]
        );

        if (existing.rows.length > 0) { //If there is any row in the result means that the user has already reviewed it.
            return res.status(409).json({ message: 'Review already exists for this product' }); // STATUS CODE 409. ERROR
        }

        // Insert the review on the database
        await db.query(
            `INSERT INTO tfg.reviews (user_id, order_id, product_id, description, star_rating)
             VALUES ($1, $2, $3, $4, $5)`,
            [user_id, order_id, product_id, description, star_rating]
        );

        res.status(201).json({ message: 'Review submitted successfully' }); //STATUS CODE, 201 SUCCESS

    } catch (err) {
        res.status(500).json({ message: 'Internal server error' }); //STATUS CODE 500, ERROR
    }
});

/*The endpoint returns all reviews for a certain product*/
router.get('/review/product/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        const result = await db.query( //RETURNS THE REVIEW ALONG WITH THE NAME OF THE USER THAT HAS REVIEWED IT
            `SELECT r.description, r.star_rating, r.created_at, u.name
                FROM tfg.reviews r
                JOIN tfg.users u ON r.user_id = u.id
                WHERE r.product_id = $1
                ORDER BY r.created_at DESC`,
            [productId]
        );
        res.status(200).json(result.rows); //STATUS CODE 200, returns the result in the body or the response.
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' }); // STATUS CODE 500, ERROR
    }
});

module.exports = router;