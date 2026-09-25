# JobNestHub

JobNestHub is a full-stack job portal that connects job seekers and recruiters through a responsive web application.

## Features

### Job Seekers

- Browse available jobs
- View job details
- Apply for jobs
- View submitted applications
- Job seeker dashboard
- User authentication

### Recruiters

- Recruiter authentication
- Employer dashboard
- Post new jobs
- Edit existing jobs
- Delete jobs
- View applicants

### Platform

- Responsive design
- Dark mode
- REST API
- MySQL database
- JWT authentication
- Password hashing

## Technology Stack

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js
- REST API
- JSON Web Token (JWT)
- bcryptjs

### Database

- MySQL

### Development

- Git
- GitHub
- GitHub Codespaces

## User Workflows

### Job Seeker

Login -> Find Jobs -> View Job -> Apply -> My Applications

### Recruiter

Login -> Employer Dashboard -> Post Job -> Manage Jobs -> View Applicants

## Local Development

### Backend

From the project root:

cd backend

node server.js

Backend runs on port 5001.

### Frontend

From the project root:

python3 frontend-server.py

Frontend runs on port 3000.

## Database

JobNestHub uses MySQL for application data, including users, jobs and applications.

Database credentials are stored in environment variables and should not be committed to GitHub.

## Security

- Passwords are hashed using bcryptjs.
- JWT is used for authentication.
- Database credentials are kept outside the source code.
- The .env file should remain private.

## Project Status

The core job-seeker and recruiter workflows have been implemented and tested.

## Author

Kavya

Full-stack web development project and portfolio application.
