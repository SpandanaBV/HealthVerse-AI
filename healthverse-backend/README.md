# HealthVerse AI — Backend (Django + DRF + JWT)

Role-based healthcare platform backend: patients, doctors, appointments,
prescriptions, and an AI symptom-prediction endpoint.

> **Note on this codebase:** every file here was written against standard,
> well-documented Django/DRF/SimpleJWT patterns, and the AI model logic was
> trained and tested directly. The Django server itself was **not** run in
> the environment that generated this code (no internet access to install
> Django there) — so run the steps below carefully and tell me about any
> error message you hit; most are one-line fixes.

## 1. Setup

```bash
# from the project root
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env              # then edit DJANGO_SECRET_KEY etc.
```

## 2. Train the AI symptom-prediction model

```bash
cd ml_model
python train_symptom_model.py
cd ..
```

This generates `ml_model/symptom_model.pkl`, `symptom_vocab.json`, and
`disease_medicines.json`. **It currently trains on a synthetic dataset** —
swap `build_synthetic_dataset()` in that file for your real disease/symptom
dataset (e.g. the Kaggle "Disease Prediction Using Machine Learning" dataset)
to use real data; everything downstream (encoding, training, saving, the API
endpoint) stays the same.

## 3. Database setup

```bash
python manage.py makemigrations accounts core
python manage.py migrate
python manage.py createsuperuser   # for /admin/ access
```

## 4. Run it

```bash
python manage.py runserver
```

API is now live at `http://localhost:8000/api/`. Admin panel at
`http://localhost:8000/admin/`.

---

## API Reference

### Auth
| Method | Endpoint | Auth | Body |
|---|---|---|---|
| POST | `/api/accounts/register/` | none | see below |
| POST | `/api/auth/login/` | none | `{username, password}` → `{access, refresh}` |
| POST | `/api/auth/refresh/` | none | `{refresh}` → `{access}` |
| GET/PATCH | `/api/accounts/me/` | Bearer token | own profile |

All other endpoints require header: `Authorization: Bearer <access_token>`

**Registration creates the linked Patient/Doctor profile automatically** — the
account is immediately usable (bookable, can predict symptoms, etc.) without
any separate admin step.

Patient registration:
```json
{
  "username": "jane", "email": "jane@example.com", "password": "secret123",
  "role": "PATIENT",
  "phone_number": "9876543210",
  "blood_group": "O+", "allergies": "", "emergency_contact": "9999999999"
}
```

Doctor registration (`specialization` and `license_number` are required):
```json
{
  "username": "dr_rao", "email": "rao@example.com", "password": "secret123",
  "role": "DOCTOR",
  "specialization": "General Physician", "license_number": "KA-12345",
  "years_of_experience": 8, "consultation_fee": 500
}
```


### Doctors & Patients
| Method | Endpoint | Who |
|---|---|---|
| GET | `/api/doctors/` | any authenticated user |
| GET | `/api/doctors/{id}/` | any authenticated user |
| GET | `/api/patients/` | patient sees self only; doctor sees their own patients; admin sees all |

### Appointments
| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/appointments/` | filtered to your own (patient or doctor) |
| POST | `/api/appointments/` | `{doctor, scheduled_at, reason}` — patient books for themself |
| PATCH | `/api/appointments/{id}/` | e.g. doctor sets `status` to `CONFIRMED`/`COMPLETED` |

### Prescriptions
| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/prescriptions/` | filtered to your own |
| POST | `/api/prescriptions/` | doctors only — `{appointment, diagnosis, medicines: [...], notes?}` |

### AI Symptom Prediction
| Method | Endpoint | Who |
|---|---|---|
| POST | `/api/predict-symptoms/` | patients only |

Request:
```json
{ "symptoms": ["headache", "nausea", "light_sensitivity"] }
```

Response:
```json
{
  "id": 1,
  "patient": 3,
  "symptoms": ["headache", "nausea", "light_sensitivity"],
  "predicted_disease": "Migraine",
  "confidence": 0.958,
  "suggested_medicines": ["Sumatriptan", "Ibuprofen", "Rest in dark room"],
  "created_at": "2026-06-24T10:00:00Z",
  "low_confidence": false
}
```

Valid symptom keys (current synthetic vocabulary — see `ml_model/symptom_vocab.json`
after training): `abdominal_pain, body_ache, burning_urination, chest_discomfort,
chills, cough, diarrhea, fatigue, frequent_urination, headache, high_fever,
itchy_eyes, light_sensitivity, mild_fever, nasal_congestion, nausea,
neck_stiffness, runny_nose, shortness_of_breath, sneezing, sore_throat, vomiting`

---

## Project structure
```
healthverse-backend/
├── manage.py
├── requirements.txt
├── .env.example
├── healthverse/        # project settings, urls, wsgi/asgi
├── accounts/           # custom User model (role-based), register/me endpoints
├── core/                # Doctor, Patient, Appointment, Prescription, SymptomPrediction
└── ml_model/            # training script + trained model + prediction service
```

## What's next (Phase 3+)
- Next.js frontend (auth pages, dashboards, booking flow, prescription view)
- CORS/integration wiring between frontend and this API
- Deployment configs for Vercel (frontend) + Render (this backend)
