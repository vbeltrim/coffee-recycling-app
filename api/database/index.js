const { Pool } = require('pg');

/*It is created a Pool that will be reused by each endpoint that
* needs to perform any operation with the database.
* As we are using dotenv, all necessary data is available in the .env file and
* when the server is running, it is loaded in the process.env */
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


module.exports = pool;
