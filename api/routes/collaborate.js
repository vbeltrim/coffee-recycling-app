const express = require('express');
const router = express.Router();
const db = require('../database');


router.post('/collaborate', async (req, res) => {
    const { name, surname, email, phone, message } = req.body

    if (!name || !surname || !email) {
        return res.status(400).json({ error: 'Name, surname, and email are required.' })
    }

    try {
        await db.query(
            'INSERT INTO tfg.collaborations (name, surname, email, phone, message) VALUES ($1, $2, $3, $4, $5)',
            [name, surname, email, phone, message]
        )
        res.status(201).json({ success: true, message: 'Thank you for your message!' })
    } catch (err) {
        console.error('Error saving collaboration:', err)
        res.status(500).json({ error: 'Failed to save message.' })
    }
})
module.exports = router;