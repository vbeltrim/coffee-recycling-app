const jwt = require('jsonwebtoken');
require('dotenv').config();


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //Agafem la part del token

    if (!token) return res.status(401).json({ error: 'Access denied: You do not have any token' }); //if it is false, return error

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}
module.exports = authenticateToken;