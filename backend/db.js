const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "127.0.0.1",
    user: "jobnesthub_user",
    password: "JobNestHub@2026!",
    database: "jobnesthub",
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
