const express = require('express');
const router = express.Router();
const db = require('../database');


/*Endpoint dedicated to store the information of a new partner.The function stores the information provided in the req.body on
* the database. First, it checks that the required fields are filled. */
router.post('/collaborate', async (req, res) => {
    const { name, surname, email, phone, message } = req.body

    if (!name || !surname || !email) { //Checking required fields are not empty.
        return res.status(400).json({ error: 'Name, surname, and email are required.' }) //STATUS CODE 400. Missing fields
    }

    try {
        await db.query(
            'INSERT INTO tfg.collaborations (name, surname, email, phone, message) VALUES ($1, $2, $3, $4, $5)', // Inserts the new entry on the database
            [name, surname, email, phone, message]
        )
        res.status(201).json({message: 'Thank you for your message!' }) //STATUS CODE 201. SUCCESS
    } catch (err) {
        res.status(500).json({ error: 'Failed to save message.' }) //STATUS CODE 500.
    }
})
module.exports = router;