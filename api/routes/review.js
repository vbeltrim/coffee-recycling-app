const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require("../middleware/auth");


/*This endpoint inserts a review on the database. There are though certain rules that have to be met.
* 1- The user must have bought the product
* 2- The user must not have reviewed the product
* */
router.post('/review', authenticateToken, async (req, res) => {
    const { order_id, product_id, description, star_rating } = req.body;
    const user_id = req.user.id;

    console.log(order_id, product_id, description, star_rating, user_id);
    //check these fields are not missing
    if (!order_id || !product_id || !description || !star_rating) {
        return res.status(400).json({ message: 'Missing fields in request' });
    }
    try { //check the product has actually been bought
        const purchaseCheck = await db.query(
            `SELECT 1
            FROM tfg.orders o
            JOIN tfg.order_items oi ON o.id = oi.order_id
            WHERE o.user_id = $1 AND oi.product_id = $2 AND o.status = 'Delivered'`,
            [user_id, product_id]
        );

        if (purchaseCheck.rows.length === 0) {
            return res.status(403).json({ message: 'You can only review products from delivered orders' });
        }

        // Check for existing review
        const existing = await db.query(
            'SELECT 1 FROM tfg.reviews WHERE user_id = $1 AND product_id = $2',
            [user_id, product_id]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ message: 'Review already exists for this product' });
        }

        // Insert the review on the database
        await db.query(
            `INSERT INTO tfg.reviews (user_id, order_id, product_id, description, star_rating)
             VALUES ($1, $2, $3, $4, $5)`,
            [user_id, order_id, product_id, description, star_rating]
        );

        res.status(200).json({ message: 'Review submitted successfully' });

    } catch (err) {
        console.error('Error submitting review:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/*The endpoint returns all reviews for a certain product*/
router.get('/review/product/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        const result = await db.query(
            `SELECT r.description, r.star_rating, r.created_at, u.name
                FROM tfg.reviews r
                JOIN tfg.users u ON r.user_id = u.id
                WHERE r.product_id = $1
                ORDER BY r.created_at DESC`,
            [productId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching product reviews:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;