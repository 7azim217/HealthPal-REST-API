// src/server.js
require('dotenv').config();
require('./models'); // ✅ loads src/models/index.js

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🏥 HealthPal API running on http://localhost:${PORT}`);
  console.log(`📘 Health check: http://localhost:${PORT}/health`);
});