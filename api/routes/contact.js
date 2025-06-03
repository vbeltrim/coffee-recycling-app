const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require("../middleware/auth");


/*The function created a new entry on the database. Similarly done in the collaborations function*/
router.post('/contact', async (req, res) => {

    const { name, surname, email, phone, message } = req.body //Takes the fields in the req.body

    if (!name || !surname || !email || !message) {
        return res.status(400).json({ error: 'Name, surname, and email are required.' }) // STATUS CODE 400. If any of the necessary fields are not complete.
    }

    try {
        await db.query( //Insers a new entry onto the database.
            'INSERT INTO tfg.contacts (name, surname, email, phone, message) VALUES ($1, $2, $3, $4, $5)',
            [name, surname, email, phone, message]
        )
        res.status(201).json({message: 'Thank you for your message!' })// STATUS CODE 201. SUCCESS
    } catch (err) {
        res.status(500).json({ error: 'Failed to save message.' }) // STATUS CODE 500. ERROR
    }
})

/*The function can only be called by an admin. The token is checked by the middleware. If it is verified the function checks the user role
* inserted by the middleware when verifying it is indeed a role = 'admin'. If it is, it returns the list of contacts from the database.*/
router.get('/contact',authenticateToken, async (req, res) =>{
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' }) // STATUS CODE 403. The user is not an administrator. Although the token is valid.
    }
    try {
        const result = await db.query('SELECT * FROM tfg.contacts ORDER BY created_at DESC')
        res.status(200).json(result.rows) // STATUS CODE 200. Returns the information of all the rows available.
    } catch (err) {
        res.status(500).json({ error: 'Server error' }) //STATUS CODE 500, ERROR.
    }
})
module.exports = router;