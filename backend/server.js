const express = require("express");
const db = require("./db");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

const PORT = process.env.PORT || 5001;

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
// User Login API
// ===============================

app.post("/api/login", function (req, res) {

    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {

        return res.status(400).json({
            message: "Email and password are required."
        });

    }

    // Find user by email
    const sql = `
        SELECT id, name, email, password, role
        FROM users
        WHERE email = ?
    `;

    db.query(sql, [email], async function (error, results) {

        if (error) {

            console.error(error);

            return res.status(500).json({
                message: "Database error."
            });

        }

        // User not found
        if (results.length === 0) {

            return res.status(401).json({
                message: "Invalid email or password."
            });

        }

        const user = results[0];

        try {

            // Compare entered password with hashed password
            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordMatch) {

                return res.status(401).json({
                    message: "Invalid email or password."
                });

            }

            // Login successful
            res.status(200).json({

                message: "Login successful!",

                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Server error."
            });

        }

    });

});
// ===============================
// Get All Jobs API
// ===============================

app.get("/api/jobs", function (req, res) {

    const sql = `
        SELECT
            id,
            title,
            company,
            location,
            description,
            salary,
            job_type,
            category,
            posted_by,
            created_at
        FROM jobs
        ORDER BY created_at DESC
    `;

    db.query(sql, function (error, results) {

        if (error) {

    console.error("Error fetching jobs:", error);

    return res.status(500).json({
        message: "Could not fetch jobs.",
        error: error.message
    });

}

        res.status(200).json({

            message: "Jobs fetched successfully!",

            jobs: results

        });

    });

});
// ===============================
// Create New Job API
// ===============================

app.post("/api/jobs", function (req, res) {

    const {
        title,
        company,
        location,
        description,
        salary,
        job_type,
        category,
        posted_by
    } = req.body;

    // Check required fields
    if (
        !title ||
        !company ||
        !location ||
        !description ||
        !posted_by
    ) {

        return res.status(400).json({
            message: "Title, company, location, description, and posted_by are required."
        });

    }

    // Insert job into database
    const sql = `
        INSERT INTO jobs
        (
            title,
            company,
            location,
            description,
            salary,
            job_type,
            category,
            posted_by
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            title,
            company,
            location,
            description,
            salary || null,
            job_type || null,
            category || null,
            posted_by
        ],
        function (error, result) {

            if (error) {

                console.error("Error creating job:", error);

                return res.status(500).json({
                    message: "Could not create job."
                });

            }

            res.status(201).json({

                message: "Job created successfully!",

                jobId: result.insertId

            });

        }
    );

});
// ===============================
// Update Job API
// ===============================

app.put("/api/jobs/:id", function (req, res) {

    const jobId = req.params.id;

    const {
        title,
        company,
        location,
        description,
        salary,
        job_type,
        category
    } = req.body;

    if (
        !title ||
        !company ||
        !location ||
        !description
    ) {

        return res.status(400).json({
            message:
                "Title, company, location, and description are required."
        });

    }

    const sql = `
        UPDATE jobs
        SET
            title = ?,
            company = ?,
            location = ?,
            description = ?,
            salary = ?,
            job_type = ?,
            category = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            title,
            company,
            location,
            description,
            salary || null,
            job_type || null,
            category || null,
            jobId
        ],
        function (error, result) {

            if (error) {

                console.error(
                    "Error updating job:",
                    error
                );

                return res.status(500).json({
                    message:
                        "Could not update job."
                });

            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message:
                        "Job not found."
                });

            }

            res.json({
                message:
                    "Job updated successfully!"
            });

        }
    );

});


// ===============================
// Delete Job API
// ===============================

app.delete("/api/jobs/:id", function (req, res) {

    const jobId = req.params.id;

    // First delete applications for this job
    const deleteApplicationsSql = `
        DELETE FROM applications
        WHERE job_id = ?
    `;

    db.query(
        deleteApplicationsSql,
        [jobId],
        function (applicationError) {

            if (applicationError) {

                console.error(
                    "Error deleting applications:",
                    applicationError
                );

                return res.status(500).json({
                    message:
                        "Could not delete job applications.",
                    error:
                        applicationError.message
                });

            }

            // Then delete the job
            const deleteJobSql = `
                DELETE FROM jobs
                WHERE id = ?
            `;

            db.query(
                deleteJobSql,
                [jobId],
                function (jobError, result) {

                    if (jobError) {

                        console.error(
                            "Error deleting job:",
                            jobError
                        );

                        return res.status(500).json({
                            message:
                                "Could not delete job.",
                            error:
                                jobError.message
                        });

                    }

                    if (result.affectedRows === 0) {

                        return res.status(404).json({
                            message:
                                "Job not found."
                        });

                    }

                    res.json({
                        message:
                            "Job and related applications deleted successfully!"
                    });

                }
            );

        }
    );

});
// ===============================
// Apply for Job API
// ===============================

app.post("/api/applications", function (req, res) {

    const {
        job_id,
        user_id,
        cover_letter
    } = req.body;

    // Check required fields
    if (!job_id || !user_id) {

        return res.status(400).json({
            message: "job_id and user_id are required."
        });

    }

    // Insert application
    const sql = `
        INSERT INTO applications
        (
            job_id,
            user_id,
            cover_letter
        )
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [
            job_id,
            user_id,
            cover_letter || null
        ],
        function (error, result) {

            if (error) {

                console.error("Error creating application:", error);

                return res.status(500).json({
                    message: "Could not submit application."
                });

            }

            res.status(201).json({

                message: "Application submitted successfully!",

                applicationId: result.insertId

            });

        }
    );

});
// ===============================
// Get User Applications API
// ===============================

app.get("/api/applications/user/:userId", function (req, res) {

    const userId = req.params.userId;

    const sql = `
        SELECT
            applications.id AS application_id,
            applications.job_id,
            applications.user_id,
            jobs.title AS job_title,
            jobs.company,
            jobs.location,
            jobs.salary,
            applications.cover_letter,
            applications.status,
            applications.applied_at
        FROM applications
        JOIN jobs
            ON applications.job_id = jobs.id
        WHERE applications.user_id = ?
        ORDER BY applications.applied_at DESC
    `;

    db.query(sql, [userId], function (error, results) {

        if (error) {

            console.error("Error fetching user applications:", error);

            return res.status(500).json({
                message: "Could not fetch applications."
            });

        }

        res.status(200).json({

            message: "Applications fetched successfully!",

            applications: results

        });

    });

});
// ===============================
// Get Job Applicants API
// ===============================

app.get("/api/applications/job/:jobId", function (req, res) {

    const jobId = req.params.jobId;

    const sql = `
        SELECT
            applications.id AS application_id,
            applications.job_id,
            applications.user_id,
            users.name AS applicant_name,
            users.email AS applicant_email,
            applications.cover_letter,
            applications.status,
            applications.applied_at
        FROM applications
        JOIN users
            ON applications.user_id = users.id
        WHERE applications.job_id = ?
        ORDER BY applications.applied_at DESC
    `;

    db.query(sql, [jobId], function (error, results) {

        if (error) {

            console.error("Error fetching job applicants:", error);

            return res.status(500).json({
                message: "Could not fetch job applicants."
            });

        }

        res.status(200).json({

            message: "Applicants fetched successfully!",

            applicants: results

        });

    });

});
// ===============================
// Update Application Status API
// ===============================

app.put("/api/applications/:id/status", function (req, res) {

    const applicationId = req.params.id;
    const { status } = req.body;

    // Check required field
    if (!status) {

        return res.status(400).json({
            message: "Status is required."
        });

    }

    // Update application status
    const sql = `
        UPDATE applications
        SET status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [status, applicationId],
        function (error, result) {

            if (error) {

                console.error("Error updating application status:", error);

                return res.status(500).json({
                    message: "Could not update application status."
                });

            }

            // Application not found
            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Application not found."
                });

            }

            res.status(200).json({

                message: "Application status updated successfully!",

                applicationId: applicationId,

                status: status

            });

        }
    );

});
// ===============================
// TEMPORARY CHECK USER API
// ===============================

app.get("/api/check-user/:email", function (req, res) {

    const email = req.params.email;

    const sql = `
        SELECT id, name, email, role
        FROM users
        WHERE email = ?
    `;

    db.query(sql, [email], function (error, results) {

        if (error) {

            console.error("Error checking user:", error);

            return res.status(500).json({
                message: "Database error."
            });

        }

        if (results.length === 0) {

            return res.status(404).json({
                message: "User not found."
            });

        }

        res.status(200).json({
            message: "User found.",
            user: results[0]
        });

    });

});

// ===============================
// Start Server
// ===============================

app.listen(PORT, function () {

    console.log(
        `JobNestHub server is running on port ${PORT}`
    );

});
