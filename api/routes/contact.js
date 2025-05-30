const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require("../middleware/auth");


router.post('/contact', async (req, res) => {
    const { name, surname, email, phone, message } = req.body

    if (!name || !surname || !email) {
        return res.status(400).json({ error: 'Name, surname, and email are required.' })
    }

    try {
        await db.query(
            'INSERT INTO tfg.contacts (name, surname, email, phone, message) VALUES ($1, $2, $3, $4, $5)',
            [name, surname, email, phone, message]
        )
        res.status(201).json({ success: true, message: 'Thank you for your message!' })
    } catch (err) {
        console.error('Error saving collaboration:', err)
        res.status(500).json({ error: 'Failed to save message.' })
    }
})
router.get('/contact',authenticateToken, async (req, res) =>{
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' })
    }
    try {
        const result = await db.query('SELECT * FROM tfg.contacts ORDER BY created_at DESC')
        res.status(200).json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
})
module.exports = router;