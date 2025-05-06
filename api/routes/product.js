const express = require('express');
const router = express.Router();
const db = require('../database');


router.get('/:id/stock', async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.execute('SELECT stock FROM products WHERE id = ?', [id]);
        const product = rows[0];

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        const stock = product.stock;
        let label;

        if (stock === 0) {
            label = 'Out of stock';
        } else if (stock <= 5) {
            label = 'Only a few left';
        } else if (stock <= 20) {
            label = 'Low stock';
        } else if (stock <= 100) {
            label = 'In stock';
        } else {
            label = 'Available';
        }

        res.status(200).json({
            productId: parseInt(id),
            stock,        // So that the frontend can put a limit to the user chosen amount.
            label        // It will be used to give a hint to the user.
        });

    } catch (error) {
        console.error('Error fetching stock info:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});
router.get('/products', async (req,res)=>{
    try{
        const [rows] = await db.execute('SELECT product_id, name, description, price FROM products');

        const products = rows.map(product=> {
            return {
                id: product.product_id,
                name: product.name,
                description: product.description,
                price: product.price
            };
        })
        res.status(200).json(products);
    }catch{
        res.status(500).json({ message: 'Server error fetching products.' });
    }
})

//Create methods that return stock and update it. They will be used by the orders endpoints.
const Product = {
    async checkStock(productId) {
        const [rows] = await db.execute('SELECT stock FROM products WHERE product_id = ?', [productId]);
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
            return false; // Not enough stock
        }

        await db.execute(
            'UPDATE products SET stock = stock - ? WHERE product_id = ?',
            [amount, productId]
        );

        return true;
    }
};

module.exports = router;
