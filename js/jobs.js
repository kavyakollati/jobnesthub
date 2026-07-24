// ===============================
// JobNestHub - Jobs JavaScript
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    const jobsContainer =
        document.getElementById("jobsContainer");

    if (!jobsContainer) {
        return;
    }

    // Backend API
    const API_URL =
        "http://localhost:5001/api/jobs";


    // ===============================
    // Load Jobs
    // ===============================

    async function loadJobs() {

        jobsContainer.innerHTML =
            "<p>Loading jobs...</p>";

        try {

            const response =
                await fetch(API_URL);

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch jobs"
                );

            }

            const data =
                await response.json();

            console.log("Jobs API response:", data);

            // Support different backend response formats
            const jobs =
                Array.isArray(data)
                    ? data
                    : data.jobs || [];

            if (jobs.length === 0) {

                jobsContainer.innerHTML =
                    "<p>No jobs available right now.</p>";

                return;
            }

            jobsContainer.innerHTML = "";

            jobs.forEach(function (job) {

                const card =
                    document.createElement("div");

                card.className =
                    "card job-card";

                card.innerHTML = `
                    <h3>${escapeHTML(job.title || "Job Title")}</h3>

                    <p>
                        <strong>Company:</strong>
                        ${escapeHTML(job.company || "Company")}
                    </p>

                    <p>
                        <strong>Location:</strong>
                        ${escapeHTML(job.location || "Location")}
                    </p>

                    <p>
                        <strong>Salary:</strong>
                        ${escapeHTML(job.salary || "Not specified")}
                    </p>

                    <button
                        class="apply-btn"
                        data-job-id="${job.id || job.job_id}">
                        Apply Now
                    </button>
                `;

                jobsContainer.appendChild(card);

            });


            // ===============================
            // Apply Buttons
            // ===============================

            const applyButtons =
                document.querySelectorAll(".apply-btn");

            applyButtons.forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const jobId =
                            button.getAttribute(
                                "data-job-id"
                            );

                        if (!jobId) {

                            alert(
                                "Job ID is missing."
                            );

                            return;
                        }

                        window.location.href =
                            "apply.html?id=" +
                            encodeURIComponent(jobId);

                    }
                );

            });


        } catch (error) {

            console.error(
                "Error loading jobs:",
                error
            );

            jobsContainer.innerHTML = `
                <p>
                    Unable to load jobs.
                    Please make sure the backend server is running.
                </p>
            `;

        }

    }


    // ===============================
    // Escape HTML
    // ===============================

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            String(value);

        return div.innerHTML;

    }


    // Start loading jobs
    loadJobs();

});