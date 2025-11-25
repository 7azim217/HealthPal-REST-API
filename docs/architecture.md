# System Architecture

## Layered Architecture
[Client Apps (Web/Mobile)]
↓ (HTTP/REST + JWT)
[Express.js Routes]
↓
[Controllers (Business Logic)]
↓
[Models (Sequelize + MySQL)]
↓
[External APIs (Google Translate, WHO)]


## Core Components
- **Authentication**: JWT tokens with 1-day expiry
- **Role-Based Access Control (RBAC)**:
  - `patient`: book consultations, request medicine, create treatments
  - `doctor`: manage consultations, reply to mental health chats
  - `donor`: fund treatments
  - `ngo`: fulfill medicine requests, create medical missions
  - `admin`: post health alerts
- **Privacy by Design**:
  - `consent_given` flag controls medical data sharing
  - Mental health chats are anonymous (`is_anonymous: true`)
- **Error Handling**:
  - Global error middleware
  - HTTP status codes (400, 401, 403, 404, 500)
  - No stack traces exposed to clients

## Security
- Passwords hashed with `bcrypt`
- All endpoints protected by JWT (except public ones like `/alerts`)
- CORS restricted to known domains
- Rate limiting (optional but recommended)

## Database Schema
Key tables:
- `users` – with `role` and `language`
- `consultations` – with `needs_translation` flag
- `treatments` + `donations` – transparency dashboard
- `medications` + `requests` – inventory system
- `therapy_chats` + `chat_messages` – anonymous support
- `medical_missions` – NGO missions
- `health_alerts` – public alerts