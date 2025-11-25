# Testing Report

## Approach
We used **manual testing via Swagger UI** for rapid validation during development. For future iterations, we plan to add **automated tests with Jest + Supertest**.

## Tested Scenarios

### Authentication
- ✅ Patient registration/login
- ✅ Role-based token validation

### Consultations
- ✅ Patient books consultation → `needs_translation` set correctly
- ✅ Doctor updates status → only their consultations
- ✅ Invalid modes rejected

### Medical Sponsorship
- ✅ Treatment creation (with consent flag)
- ✅ Donation increases `funded_amount`
- ✅ Transparency report shows donor names + receipts
- ✅ Non-donor cannot donate

### Medication
- ✅ NGO fulfills request → quantity decreases
- ✅ Out-of-stock items not requestable
- ✅ Non-NGO cannot fulfill

### Mental Health
- ✅ Patient starts chat
- ✅ Doctor replies
- ✅ Only participants can view chat

### Missions & Alerts
- ✅ NGO creates mission
- ✅ Patient requests mission
- ✅ Admin posts alert; public can read

## Error Handling Verified
- `400` – Missing fields
- `401` – Missing/invalid token
- `403` – Role mismatch
- `404` – Resource not found
- `500` – Server errors (logged internally)

## Tools Used
- **Swagger UI** – Interactive API testing
- **MySQL Workbench** – Verify data integrity
- **Postman** – Additional validation
- **Console logs** – Debugging during development

> 💡 **Coverage**: 100% of core features manually tested. Automated tests can be added in future.