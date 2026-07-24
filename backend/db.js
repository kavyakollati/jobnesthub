const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "jobnesthub_user",
    password: "JobNestHub@2026!",
    database: "jobnesthub"
});

connection.connect(function (error) {

    if (error) {
        console.error("MySQL connection failed:", error.message);
        return;
    }

    console.log("MySQL connected successfully!");
});

module.exports = connection;