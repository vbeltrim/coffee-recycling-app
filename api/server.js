
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const auth = require('./routes/authentication');
const collaborateRoutes = require('./routes/collaborate');
const orders = require('./routes/orders')
const product = require('./routes/product')
app.use('/', auth);


// Start server
const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});
//console.log("JWT_SECRET is:", process.env.JWT_SECRET);
