// src/models/index.js
const User = require('./User');
const Consultation = require('./Consultation');
const Treatment = require('./Treatment');
const Donation = require('./Donation');
const Medication = require('./Medication'); // ← ADD THIS
const Request = require('./Request');       // ← ADD THIS

// Consultation ↔ User
Consultation.belongsTo(User, { as: 'Patient', foreignKey: 'patient_id' });
Consultation.belongsTo(User, { as: 'Doctor', foreignKey: 'doctor_id' });

// Treatment ↔ User
Treatment.belongsTo(User, { as: 'Patient', foreignKey: 'patient_id' });

// Donation ↔ User
Donation.belongsTo(User, { as: 'Donor', foreignKey: 'donor_id' });

// Treatment ↔ Donation
Treatment.hasMany(Donation, { as: 'Donations', foreignKey: 'treatment_id' });
Donation.belongsTo(Treatment, { foreignKey: 'treatment_id' });

// Medication ↔ Request
Medication.hasMany(Request, { foreignKey: 'medication_id' });
Request.belongsTo(Medication, { foreignKey: 'medication_id' });

// Optional: Request ↔ User (requester)
Request.belongsTo(User, { as: 'Requester', foreignKey: 'requester_id' });

module.exports = {
  User,
  Consultation,
  Treatment,
  Donation,
  Medication, // ← EXPORT
  Request,    // ← EXPORT
};