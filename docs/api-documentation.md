# API Documentation

## Swagger UI
All endpoints are fully documented in **Swagger UI**:

🔗 **http://localhost:3000/api-docs** (local)  
🔗 **[Your Deployed URL]/api-docs** (production)

## Authentication
1. Register: `POST /auth/register`
2. Login: `POST /auth/login` → receive JWT
3. Include in headers:

Authorization: Bearer <your_token>


## Core Endpoints

### 1. Consultations
- `POST /consultations` – Book with doctor, mode (`audio`/`video`/`chat`)
- `GET /consultations` – List your consultations
- Auto sets `needs_translation` if patient/doctors speak different languages

### 2. Medical Sponsorship
- `POST /treatments` – Create treatment request (patient)
- `GET /treatments` – Public list of needs
- `POST /treatments/donations` – Fund a treatment (donor)
- `GET /treatments/{id}/transparency` – Full donor report

### 3. Medication
- `GET /medications/available` – Public inventory
- `POST /medications/requests` – Request item (patient)
- `PUT /medications/requests/{id}/fulfill` – Fulfill (NGO)

### 4. Health Alerts
- `GET /alerts?region=gaza` – Public alerts
- `POST /alerts` – Create (admin only)

### 5. Mental Health
- `POST /mental-health/chat` – Start anonymous session
- `POST /mental-health/chat/{id}/message` – Send message
- `GET /mental-health/chat/{id}` – View transcript

### 6. Medical Missions
- `GET /missions` – Public list
- `POST /missions` – Create (NGO)
- `POST /missions/{id}/request` – Request (patient)

> ✅ All endpoints enforce role-based access and return clear error messages.