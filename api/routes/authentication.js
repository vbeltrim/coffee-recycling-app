
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('../database');
const authenticateToken = require("../middleware/auth");
require('dotenv').config();


//PER A REGISTRAR UN USUARI
router.post('/register', async(req,res)=>{
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const password = req.body.password;
    let passwordToStore; //S'utilizarà sols si vull encriptar la contrasenya
    const useEncryption = true;

    try{ // check if the user already exists in the database
        const userExists = await database.query('SELECT * FROM tfg.users WHERE email = $1', [email])
        if (userExists.rows.length>0){ //Si nhi ha més de 0 vol dir que existeix
            return res.status(409).json({error: 'User already exists'});
        }
        if (useEncryption) {
            const salt = await bcrypt.genSalt(10);
            passwordToStore = await bcrypt.hash(password, salt);
        } else {
            passwordToStore = password; // Stores plain password (NOT secure, only for testing)
        }
        const newUser = await database.query(
            'INSERT INTO tfg.users (name,surname,email, password) VALUES ($1, $2, $3, $4) RETURNING id, name, surname, email',
            [name,surname,email,passwordToStore]
        );
        const token = jwt.sign(
            {
                id: newUser.rows[0].id,
                name: newUser.rows[0].name,
                surname:newUser.rows[0].surname,
                email: newUser.rows[0].email,
                role: newUser.rows[0].role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Server error'});
    }

})
//PER VEURE SI L'USUARI ESTÀ JA REGISTRAT
router.post('/login', async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    try{ // check if the user already exists in the database
        const userExists = await database.query('SELECT * FROM tfg.users WHERE email = $1', [email])
        const match = await bcrypt.compare(password, userExists.rows[0].password)
        if (userExists.rows.length>0 && match==true){ //Si nhi ha més de 0 vol dir que existeix
                const token = jwt.sign(
                    {
                        id: userExists.rows[0].id,
                        name: userExists.rows[0].name,
                        surname: userExists.rows[0].surname,
                        email: userExists.rows[0].email,
                        role: userExists.rows[0].role
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
                res.status(201).json({ token });
        }
        else{
            return res.status(400).json({error: 'User does not exist or password is not correct'});
        }
    }catch (error) {
        res.status(500).json({error: 'Server error'});
    }})
router.post('/password', authenticateToken, async (req,res)=>{


    const { email, newPassword } = req.body
    if (!email || !newPassword) {
        return res.status(400).json({ error: 'Missing fields' })
    }
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        await database.query(
            'UPDATE tfg.users SET password = $1 WHERE email = $2',
            [hashedPassword, email]
        )
        res.status(200).json({ message: 'Password updated successfully' })
    } catch (err) {
        console.error('Password update error:', err)
        res.status(500).json({ error: 'Server error' })
    }
})

module.exports = router;