require("dotenv").config({
    path: "../.env"
});

const mysql = require("mysql2");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
pool.getConnection(function (error, connection) {

    if (error) {
        console.error(
            "MySQL connection failed:",
            error.message
        );
        return;
    }

    console.log(
        "MySQL connected successfully!"
    );

    connection.release();
});

module.exports = pool;
