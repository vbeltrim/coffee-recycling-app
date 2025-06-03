
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // Used for encryption.
const jwt = require('jsonwebtoken'); //Uses JWT.
const database = require('../database'); // Database index defined in ../database
const authenticateToken = require("../middleware/auth"); // Uses the middleware
require('dotenv').config();



/* The request is mounted on the "/" of the API. It uses the information found in the body of the request to
* create a new entry on the USERS table of the database. */
router.post('/register', async(req,res)=>{


    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const password = req.body.password;
    let passwordToStore; // With contain the password encrypted which is the one on the database.


    try{ // Security check, check if there is any user currently using this email in the db, as it is the PK

        const userExists = await database.query('SELECT * FROM tfg.users WHERE email = $1', [email]) //Performs the query

        if (userExists.rows.length>0){ //If there is any row in the db response, means this user exists.
            return res.status(409).json({error: 'User already exists'}); // Return error 409, as it is a repetitive entry.
        }

        //Otherwise, the password is encrypted using bcrypt
        const salt = await bcrypt.genSalt(10);

        passwordToStore = await bcrypt.hash(password, salt);

        // The new user is created on the database with the information provided in the body of the request.
        const newUser = await database.query(
            'INSERT INTO tfg.users (name,surname,email, password) VALUES ($1, $2, $3, $4) RETURNING id, name, surname, email',
            [name,surname,email,passwordToStore]
        );


        /*The token is created and attached to the response. The frontend will store it in localStorage for
        authenticate in the platform*/
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
        res.status(201).json({ token }); // STATUS CODE 201, SUCCESS
    } catch (error) {
        res.status(500).json({ error: 'Server error'}); // STATUS CODE 500, SERVER ERROR
    }

})

/*The function is used to authenticate users on the database. Takes the information on the request body: email and password.
* Checks if the user exists on the database, meaning if it has already signed up and if exists, returns a token */
router.post('/login', async(req,res)=>{


    const email = req.body.email;
    const password = req.body.password;


    try{

        const userExists = await database.query('SELECT * FROM tfg.users WHERE email = $1', [email]) //Checks if the euser exists on the database

        const match = await bcrypt.compare(password, userExists.rows[0].password) // Compares the passwords, remember the one on the db is encrypted.

        if (userExists.rows.length>0 && match==true){  //If the user exists and the password matches, the user will be able to sign in.
                const token = jwt.sign( //It creates a token
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
                res.status(201).json({ token }); // Returns the STATUS CODE 201, including the token on the res.body
        }
        else{
            return res.status(400).json({error: 'User does not exist or password is not correct'}); // STATUS ERROR 400, either there is an error on the email or the password
        }
    }catch (error) {
        res.status(500).json({error: 'Server error'});
    }
})

/*The function changes the password of the user. First, it has to be confirmed by the middleware that the user has a valid token.
* Once confirmed, it will be checked that the body contains the required fields. If it does, the password will be changed.*/
router.post('/password', authenticateToken, async (req,res)=>{

    const { newPassword } = req.body //The password is the same as the one on the req.body

    const {email} = req.user; //The email must be the one added by the middleware. Otherwise, anyone with a valid token could change someone else' password.

    if (!email || !newPassword) { //Check fields, otherwise return STATUS CODE 400. Missing fields.
        return res.status(400).json({ error: 'Missing fields' })
    }
    try{

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt) //Encrypts new password

        await database.query( //updates the database data
            'UPDATE tfg.users SET password = $1 WHERE email = $2',
            [hashedPassword, email]
        )
        res.status(200).json({ message: 'Password updated successfully' }) //STATUS CODE 200.
    } catch (err) {
        res.status(500).json({ error: 'Server error' }) // Returns STATUS CODE 500 otherwise.
    }
})

module.exports = router;