
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: 'https://coffee-fuel.web.app', // explicitly set the frontend origin
    credentials: true
}))
app.use(express.json());

// Routes
const authenication = require('./routes/authentication');
const collaborate = require('./routes/collaborate');
const orders = require('./routes/orders')
const product = require('./routes/product')
const review = require('./routes/review')
const contact = require('./routes/contact')
app.use('/', authenication);
app.use('/', product);
app.use('/', orders);
app.use('/', collaborate);
app.use('/', review);
app.use('/', contact);


// Start server
const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});
