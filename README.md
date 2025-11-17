MediConnect

MediConnect is a Healthcare Appointment Management System built with Spring Boot (Java) and React.
It enables patients to easily book doctor appointments online, while doctors and admins manage schedules, patients, and feedback through an integrated platform.

⸻

🚀 Features

🔹 Patient
	•	Register/Login securely (JWT authentication).
	•	View available doctors and specializations.
	•	Book, reschedule, and cancel appointments.
	•	View past appointment history.
	•	Provide feedback and ratings for doctors.

🔹 Doctor
	•	Manage profile and specialization.
	•	View daily/weekly schedules.
	•	Accept or decline appointment requests.
	•	View patient history before consultations.

🔹 Admin
	•	Manage doctors, patients, and users.
	•	Approve doctor registrations.
	•	Monitor system activity.

⸻

🛠️ Tech Stack
	•	Backend: Spring Boot, Spring Security (JWT), Hibernate, MySQL
	•	Frontend: React, React Router, Axios, Bootstrap/Tailwind
	•	Database: MySQL 8.0
	•	Build Tools: Maven (backend), npm (frontend)
	•	IDE: IntelliJ IDEA, VS Code

    ⚡ Getting Started

🔹 Prerequisites
	•	Java 17+
	•	Node.js 18+
	•	MySQL 8.0+
	•	Maven

🔹 Backend Setup
cd backend
mvn clean install
mvn spring-boot:run

The backend will run on: http://localhost:8081

🔹 Frontend Setup
cd frontend
npm install
npm start

The frontend runs on: http://localhost:5173

🧪 Test Data

We provide a SQL script to populate test users, doctors, patients, schedules, and appointments:
➡️ test_data.sql
➡️ test_data_luchitha.sql


This project is developed as part of SE2072 – Software Engineering Module (SLIIT).