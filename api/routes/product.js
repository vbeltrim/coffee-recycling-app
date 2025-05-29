const express = require('express');
const router = express.Router();
const db = require('../database');


router.get('/products', async (req,res)=>{

    try{

        const result = await db.query('SELECT * FROM tfg.products');

        const products = result.rows.map(product=> {
            return {
                id: product.id,
                name: product.name,
                shortDescription: product.short_description,
                longDescription: product.long_description,
                price: product.price,
                stock: product.stock,
                url_image: product.url_image
            };
        })
        res.status(200).json(products);
    }catch(err){
        console.error('DB error:', err)
        res.status(500).json({ message: 'Server error fetching products.' });
    }
})


//Create methods that return stock and update it. They will be used by the orders endpoints.
const Product = {
    async checkStock(productId) {
        const [rows] = await db.query('SELECT stock FROM products WHERE product_id = ?', [productId]);
        return rows[0]?.stock ?? null; // returns null if not found
    },
    async productExists(productId) {
        const [rows] = await db.execute(
            'SELECT 1 FROM products WHERE product_id = ? LIMIT 1',
            [productId]
        );
        return rows.length > 0;
    },
    async getPrice(productId) {
        const [rows] = await db.execute('SELECT price FROM products WHERE product_id = ?', [productId]);
        return rows[0]?.price ?? null;
    },
    async reduceStock(productId, amount) {
        if (amount <= 0) {
            throw new Error('Amount to reduce must be greater than 0');
        }
        const currentStock = await this.checkStock(productId);

        if (currentStock < amount) {
            return false; //
        }

        await db.query(
            'UPDATE products SET stock = stock - ? WHERE product_id = ?',
            [amount, productId]
        );

        return true;
    }
};

module.exports = router;
