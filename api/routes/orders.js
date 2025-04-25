const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('../database');
const authenticateToken = require('../middleware/auth')
require('dotenv').config();

router.get('/',authenticateToken, async (req,res) =>{

    //First it will be checked whether the request comes from a user or an admin
    const { id: userId, role} = req.user;
    //-> userId = req.user.id
    //-> role = req.user.role
    let result;
    try{
        if(role === 'admin'){ //The req comes from an admin
            result = await database.query(
                'SELECT \n' +
                '  o.*, \n' +
                '  i.pellets, \n' +
                '  i.logs\n' +
                'FROM tfg.orders o\n' +
                'JOIN tfg.order_items i ON o.id = i.order_id;'
            );
        }else{ //The req comes from a user
            result = await database.query( //This way i get all the orders + the products contained in the order which are in the table order_items
                'SELECT \n' +
                '  o.*, \n' +
                '  i.pellets, \n' +
                '  i.logs\n' +
                'FROM tfg.orders o\n' +
                'JOIN tfg.order_items i ON o.id = i.order_id\n' +
                'WHERE o.user_id = $1\n' +
                'ORDER BY o.created_at DESC;',[user_id]
            );
        }
        res.status(200).json(
            {
                orders : result.rows
            }
        );
    }catch (error){
        res.status(500).json({ error: 'Error fetching your orders' });
    }
});

//in order to create a post order, it should be checked if there is enough stock. And if the payment when well.
router.post('/',authenticateToken, async  )