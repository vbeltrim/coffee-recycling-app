const jwt = require('jsonwebtoken');
require('dotenv').config();

/*The function authenticateToken acts as middleware. When it is called through an Express function
* It removes the token added on the header (if available). Verifies it and adds the user information on the req.body
* do that afterward can be used by any of the endpoint functions.
*  The function returns:
* STATE ERROR 401 -> There is no token available
* STATE ERROR 401 -> There is a token, but it is not valid. */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //The token is taken from the header

    if (!token) return res.status(401).json({ error: 'Access denied: You do not have any token' }); //if it is false, return error 401

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => { // The token is verified with the SECRET in the defined in .env
        if (err) return res.status(401).json({ error: 'Invalid token' }); //If it is not valid, return error 401.
        req.user = user; // Adds the user information on the req. Accessed on req.user.
        next(); //The endpoint function handles the http request now.
    });
}
module.exports = authenticateToken;