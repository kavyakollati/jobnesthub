const express = require("express");
const db = require("./db");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5001;


// ===============================
// Test Route
// ===============================

app.get("/", function (req, res) {

    res.send("Welcome to JobNestHub Backend API!");

});


// ===============================
// User Registration API
// ===============================

app.post("/api/register", async function (req, res) {

    const { name, email, password, role } = req.body;

    // Check required fields
    if (!name || !email || !password) {

        return res.status(400).json({
            message: "Name, email, and password are required."
        });

    }

    try {

        // Check if email already exists
        const checkSql = "SELECT id FROM users WHERE email = ?";

        db.query(checkSql, [email], async function (error, results) {

            if (error) {

                console.error(error);

                return res.status(500).json({
                    message: "Database error."
                });

            }

            // Check duplicate email
            if (results.length > 0) {

                return res.status(409).json({
                    message: "Email is already registered."
                });

            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new user
            const insertSql = `
                INSERT INTO users (name, email, password, role)
                VALUES (?, ?, ?, ?)
            `;

            db.query(
                insertSql,
                [
                    name,
                    email,
                    hashedPassword,
                    role || "jobseeker"
                ],
                function (error, result) {

                    if (error) {

                        console.error(error);

                        return res.status(500).json({
                            message: "Could not create user."
                        });

                    }

                    res.status(201).json({

                        message: "User registered successfully!",

                        userId: result.insertId

                    });

                }
            );

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error."
        });

    }

});


// ===============================
// Start Server
// ===============================

app.listen(PORT, function () {

    console.log(
        `JobNestHub server is running on port ${PORT}`
    );

});