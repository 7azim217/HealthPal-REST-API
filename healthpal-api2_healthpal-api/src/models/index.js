// src/models/index.js
const User = require('./User');
const Consultation = require('./Consultation');
const Treatment = require('./Treatment');
const Donation = require('./Donation');
const Medication = require('./Medication');
const Request = require('./Request');
const HealthAlert = require('./HealthAlert');
const TherapyChat = require('./TherapyChat');
const ChatMessage = require('./ChatMessage');
const MedicalMission = require('./MedicalMission');     // ← ADD
const MissionRequest = require('./MissionRequest');     // ← ADD

// Existing associations...
Consultation.belongsTo(User, { as: 'Patient', foreignKey: 'patient_id' });
Consultation.belongsTo(User, { as: 'Doctor', foreignKey: 'doctor_id' });
Treatment.belongsTo(User, { as: 'Patient', foreignKey: 'patient_id' });
Donation.belongsTo(User, { as: 'Donor', foreignKey: 'donor_id' });
Treatment.hasMany(Donation, { as: 'Donations', foreignKey: 'treatment_id' });
Donation.belongsTo(Treatment, { foreignKey: 'treatment_id' });
Medication.hasMany(Request, { foreignKey: 'medication_id' });
Request.belongsTo(Medication, { foreignKey: 'medication_id' });
Request.belongsTo(User, { as: 'Requester', foreignKey: 'requester_id' });
TherapyChat.hasMany(ChatMessage, { foreignKey: 'chat_id' });
ChatMessage.belongsTo(TherapyChat, { foreignKey: 'chat_id' });

// New associations for Medical Missions
MedicalMission.belongsTo(User, { as: 'NGO', foreignKey: 'ngo_id' });
MissionRequest.belongsTo(User, { as: 'Patient', foreignKey: 'patient_id' });
MissionRequest.belongsTo(MedicalMission, { foreignKey: 'mission_id' });

module.exports = {
  User,
  Consultation,
  Treatment,
  Donation,
  Medication,
  Request,
  HealthAlert,
  TherapyChat,
  ChatMessage,
  MedicalMission,      // ← EXPORT
  MissionRequest,      // ← EXPORT
};