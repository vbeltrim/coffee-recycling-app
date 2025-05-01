const express = require('express');
const router = express.Router();
const db = require('../config/database');


router.post('/', async (req, res) => {
    const { name, surname, email, phone, message } = req.body;

    //Check the fields are not empty. But message that is optional
    if (!name || !surname || !email) {
        return res.status(400).json({ message: 'Name, surname, email are reequired.' });
    }

    try {
        await db.execute(
            `INSERT INTO collaborate (name, surname, email, phone, message)
       VALUES (?, ?, ?, ?, ?)`,
            [name, surname, email, phone || null, message || null]
        );

        res.status(201).json({ message: 'Your message has been received.' });
    } catch (error) {
        console.error('Error inserting collaboration request:', error);
        res.status(500).json({ message: 'Server error while submitting your message.' });
    }
});

module.exports = router;