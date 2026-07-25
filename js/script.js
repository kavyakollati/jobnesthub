// ===============================
// JobNestHub - Main JavaScript
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    // ===============================
    // Dark Mode
    // ===============================

    const themeBtn = document.getElementById("themeBtn");

    if (themeBtn) {

        // Load saved theme
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme === "dark") {
            document.body.classList.add("dark-mode");
            themeBtn.textContent = "☀️ Light Mode";
        }

        themeBtn.addEventListener("click", function () {

            document.body.classList.toggle("dark-mode");

            if (document.body.classList.contains("dark-mode")) {
                themeBtn.textContent = "☀️ Light Mode";
                localStorage.setItem("theme", "dark");
            } else {
                themeBtn.textContent = "🌙 Dark Mode";
                localStorage.setItem("theme", "light");
            }

        });
    }


    // ===============================
    // Today's Date
    // ===============================

    const todayDate = document.getElementById("todayDate");

    if (todayDate) {

        const today = new Date();

        const formattedDate = today.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        todayDate.textContent = "Today: " + formattedDate;
    }


    // ===============================
    // Job Search
    // ===============================

    const searchBtn = document.getElementById("searchBtn");
    const jobSearch = document.getElementById("jobSearch");
    const locationSearch = document.getElementById("locationSearch");
    const searchResult = document.getElementById("searchResult");

    if (searchBtn && jobSearch && locationSearch) {

        searchBtn.addEventListener("click", function () {

            const job = jobSearch.value.trim();
            const location = locationSearch.value.trim();

            if (job === "" && location === "") {

                searchResult.textContent =
                    "Please enter a job title or location.";

                return;
            }

            let message = "Searching for ";

            if (job !== "") {
                message += `"${job}"`;
            }

            if (location !== "") {
                if (job !== "") {
                    message += " jobs in ";
                } else {
                    message += "jobs in ";
                }

                message += `"${location}"`;
            }

            searchResult.textContent = message + "...";

            // Go to jobs page
            setTimeout(function () {
                window.location.href = "jobs.html";
            }, 500);

        });
    }


    // ===============================
    // Featured Job Count
    // ===============================

    const jobCount = document.getElementById("jobCount");

    if (jobCount) {

        const jobCards = document.querySelectorAll(
            ".job-card"
        );

        jobCount.textContent = jobCards.length;
    }


    // ===============================
    // Register Form
    // ===============================

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {

        registerForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const name =
                document.getElementById("registerName").value.trim();

            const email =
                document.getElementById("registerEmail").value.trim();

            const password =
                document.getElementById("registerPassword").value;

            const role =
                document.getElementById("registerRole").value;

            const result =
                document.getElementById("registerResult");

            if (!name || !email || !password || !role) {

                result.textContent =
                    "Please fill in all fields.";

                return;
            }

            try {

                result.textContent =
                    "Creating your account...";

                const response = await fetch(
                    "https://humble-space-goggles-7vp979v5gj57cp79g-5001.app.github.dev/api/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            name,
                            email,
                            password,
                            role
                        })
                    }
                );

                const data = await response.json();

                if (response.ok) {

                    result.textContent =
                        data.message || "Registration successful!";

                    registerForm.reset();

                } else {

                    result.textContent =
                        data.message || "Registration failed.";

                }

            } catch (error) {

                console.error("Registration error:", error);

                result.textContent =
                    "Unable to connect to the server.";

            }

        });
    }


    // ===============================
    // Login Form
    // ===============================

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const email =
                document.getElementById("loginEmail").value.trim();

            const password =
                document.getElementById("loginPassword").value;

            const result =
                document.getElementById("loginResult");

            if (!email || !password) {

                result.textContent =
                    "Please enter your email and password.";

                return;
            }

            try {

                result.textContent =
                    "Logging in...";

                const response = await fetch(
                   "https://humble-space-goggles-7vp979v5gj57cp79g-5001.app.github.dev/api/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );

                const data = await response.json();

                if (response.ok) {

                    result.textContent =
                        data.message || "Login successful!";

                    // Save user information
                    if (data.user) {
                        localStorage.setItem(
                            "user",
                            JSON.stringify(data.user)
                        );
                    }

                    // Redirect after successful login
                    setTimeout(function () {
                        window.location.href = "index.html";
                    }, 1000);

                } else {

                    result.textContent =
                        data.message || "Invalid login details.";

                }

            } catch (error) {

                console.error("Login error:", error);

                result.textContent =
                    "Unable to connect to the server.";

            }

        });
    }


    // ===============================
    // Subscribe Button
    // ===============================

    const subscribeBtn =
        document.getElementById("subscribeBtn");

    const emailInput =
        document.getElementById("emailInput");

    if (subscribeBtn && emailInput) {

        subscribeBtn.addEventListener("click", function () {

            const email =
                emailInput.value.trim();

            if (email === "") {

                alert("Please enter your email address.");

            } else if (
                !email.includes("@") ||
                !email.includes(".")
            ) {

                alert("Please enter a valid email address.");

            } else {

                alert(
                    "Thank you for subscribing to JobNestHub!"
                );

                emailInput.value = "";

            }

        });
    }


    // ===============================
    // Back To Top Button
    // ===============================

    const topBtn =
        document.getElementById("topBtn");

    if (topBtn) {

        window.addEventListener("scroll", function () {

            if (window.scrollY > 300) {

                topBtn.style.display = "block";

            } else {

                topBtn.style.display = "none";

            }

        });

        topBtn.addEventListener("click", function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }

});