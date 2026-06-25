# 🩺 HealthVerse AI

<p align="center">

![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge\&logo=angular)
![Django](https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge\&logo=django)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge\&logo=python)
![DRF](https://img.shields.io/badge/Django_REST_Framework-API-red?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge)
![Machine Learning](https://img.shields.io/badge/AI-Symptom_Prediction-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</p>

<p align="center">
An AI-powered healthcare platform that enables secure communication between <b>Patients</b> and <b>Doctors</b> through role-based authentication, appointment scheduling, digital prescriptions, and AI-assisted symptom prediction.
</p>

---

# 📖 Overview

HealthVerse AI is a modern **full-stack healthcare management platform** designed to simplify healthcare interactions while demonstrating industry-standard software engineering practices.

The application combines:

* 🔐 Secure JWT Authentication
* 👨‍⚕️ Doctor & Patient Role Management
* 📅 Appointment Booking System
* 💊 Digital Prescription Management
* 🤖 Machine Learning Based Disease Prediction
* 🌐 RESTful APIs
* 🎨 Modern Angular 19 UI

This project follows a scalable architecture where the **Angular frontend** communicates with a **Django REST Framework backend**, while an integrated Machine Learning model predicts diseases from patient symptoms.

---

# ✨ Features

## 🔐 Authentication

* User Registration
* Secure Login
* JWT Authentication
* Token Refresh
* Role-Based Authorization
* Protected Routes

---

## 👨‍⚕️ Doctor Module

* Doctor Registration
* Doctor Dashboard
* View Patient Appointments
* Confirm Appointments
* Complete Appointments
* Issue Digital Prescriptions

---

## 🧑‍🤝‍🧑 Patient Module

* Patient Registration
* Patient Dashboard
* View Doctor Directory
* Book Appointments
* View Prescriptions
* AI Symptom Checker

---

## 🤖 AI Module

* Symptom Prediction API
* Disease Prediction
* Confidence Score
* Medicine Suggestions
* Machine Learning Model Integration

---

## 🔒 Security

* JWT Access Tokens
* Refresh Tokens
* Role-Based Permissions
* Protected API Endpoints
* Angular Route Guards
* HTTP Interceptors

---

# 🏗️ System Architecture

```text
                    +----------------------+
                    |     Angular 19       |
                    |  Standalone Frontend |
                    +----------+-----------+
                               |
                               |
                      REST API (HTTP)
                               |
                               |
                    +----------v-----------+
                    | Django REST Framework|
                    | JWT Authentication   |
                    +----------+-----------+
                               |
         +---------------------+----------------------+
         |                     |                      |
         |                     |                      |
+--------v-------+    +--------v-------+     +--------v-------+
| Authentication |    | Healthcare API |     | AI Prediction  |
| Users & Roles  |    | CRUD Services  |     | Scikit-Learn   |
+--------+-------+    +--------+-------+     +--------+-------+
         |                     |                      |
         +---------------------+----------------------+
                               |
                        SQLite Database
```

---

# 🛠 Tech Stack

## Frontend

* Angular 19
* TypeScript
* Angular Signals
* RxJS
* Tailwind CSS
* Standalone Components

---

## Backend

* Django
* Django REST Framework
* Django Simple JWT
* Python

---

## Database

* SQLite (Development)

---

## Machine Learning

* Scikit-Learn
* NumPy
* Pandas
* Joblib

---

## Tools

* Git
* GitHub
* VS Code
* Postman

---

# 📂 Project Structure

```text
HealthVerse-AI
│
├── healthverse-backend
│   ├── accounts
│   ├── core
│   ├── healthverse
│   ├── ml_model
│   ├── requirements.txt
│   └── manage.py
│
├── healthverse-frontend
│   ├── src
│   │   ├── app
│   │   ├── environments
│   │   └── styles.css
│   ├── package.json
│   └── angular.json
│
├── .gitignore
└── README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/SpandanaBV/HealthVerse-AI.git
cd HealthVerse-AI
```

---

# ⚙ Backend Setup

```bash
cd healthverse-backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt
```

### Train the AI Model

```bash
cd ml_model
python train_symptom_model.py
cd ..
```

### Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

### Start Backend

```bash
python manage.py runserver
```

Backend:

```
http://localhost:8000
```

---

# 🎨 Frontend Setup

```bash
cd healthverse-frontend

npm install
npm start
```

Frontend:

```
http://localhost:4200
```

---

# 🔌 API Endpoints

## Authentication

| Method | Endpoint                  |
| ------ | ------------------------- |
| POST   | `/api/accounts/register/` |
| POST   | `/api/auth/login/`        |
| POST   | `/api/auth/refresh/`      |
| GET    | `/api/accounts/me/`       |

---

## Doctors

| Method | Endpoint             |
| ------ | -------------------- |
| GET    | `/api/doctors/`      |
| GET    | `/api/doctors/{id}/` |

---

## Patients

| Method | Endpoint         |
| ------ | ---------------- |
| GET    | `/api/patients/` |

---

## Appointments

| Method | Endpoint                  |
| ------ | ------------------------- |
| GET    | `/api/appointments/`      |
| POST   | `/api/appointments/`      |
| PATCH  | `/api/appointments/{id}/` |

---

## Prescriptions

| Method | Endpoint              |
| ------ | --------------------- |
| GET    | `/api/prescriptions/` |
| POST   | `/api/prescriptions/` |

---

## AI Symptom Prediction

| Method | Endpoint                 |
| ------ | ------------------------ |
| POST   | `/api/predict-symptoms/` |

Example Request

```json
{
  "symptoms": [
    "headache",
    "nausea",
    "light_sensitivity"
  ]
}
```

---

# 🤖 Machine Learning Workflow

```text
Patient Symptoms
        │
        ▼
Feature Encoding
        │
        ▼
Scikit-Learn Model
        │
        ▼
Disease Prediction
        │
        ▼
Confidence Score
        │
        ▼
Medicine Recommendation
```

---

# 📸 Application Screenshots

> Add screenshots here after deployment.

* Login Page
* Register Page
* Patient Dashboard
* Doctor Dashboard
* Appointment Booking
* Prescription History
* AI Symptom Checker

---

# 🔮 Future Enhancements

* Video Consultation
* Medical Report Upload
* Email Notifications
* SMS Appointment Reminders
* Payment Gateway
* Doctor Availability Calendar
* Admin Dashboard
* Analytics
* Cloud Deployment (Render + Vercel)
* Docker Support
* CI/CD Pipeline

---

# 👩‍💻 Author

**Spandana B V**

* GitHub: https://github.com/SpandanaBV
* LinkedIn: https://www.linkedin.com/in/spandanavaishnav/

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

It helps others discover the project and supports future development.
