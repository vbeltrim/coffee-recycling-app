
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('../database');
require('dotenv').config();


//PER A REGISTRAR UN USUARI
router.post('/register', async(req,res)=>{
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const password = req.body.password;
    let passwordToStore; //S'utilizarà sols si vull encriptar la contrasenya
    console.log(' /register endpoint was hit');
    const useEncryption = true;

    try{ // check if the user already exists in the database
        const userExists = await database.query('SELECT * FROM tfg.users WHERE email = $1', [email])
        if (userExists.rows.length>0){ //Si nhi ha més de 0 vol dir que existeix
            return res.status(400).json({error: 'User already exists'});
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
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error'});
    }

})
//PER VEURE SI L'USUARI ESTÀ JA REGISTRAT
router.post('/login', async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    console.log('/login endpoint was hit');

    try{ // check if the user already exists in the database
        const userExists = await database.query('SELECT * FROM tfg.users WHERE email = $1', [email])
        if (userExists.rows.length>0){ //Si nhi ha més de 0 vol dir que existeix
            const match = await bcrypt.compare(password, userExists.rows[0].password);
            if (match == true){ //True meaning that the password is correct.
                const token = jwt.sign(
                    {
                        id: userExists.rows[0].id,
                        email: userExists.rows[0].email,
                        role: userExists.rows[0].role
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
                res.status(201).json({ token });
            }
        }
        else{
            return res.status(400).json({error: 'User does not exist or password is not correct'});
        }
    }catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({error: 'Server error'});
    }})
module.exports = router;