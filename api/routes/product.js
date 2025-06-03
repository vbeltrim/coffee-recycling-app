const express = require('express');
const router = express.Router();
const db = require('../database');

/*The method returns the products available in the products table. */
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
        res.status(200).json(products); //STATUS CODE 200. RETURNS THE PRODUCTS IN THE DATABASE
    }catch(err){
        console.error('DB error:', err)
        res.status(500).json({ message: 'Server error fetching products.' });
    }
})

module.exports = router;
