const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const sequelize = require('./config/database');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const routes = require('./routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

if (process.env.NODE_ENV === 'development') {
  sequelize.sync({ alter: true })
    .then(() => console.log('✅ Database synced'))
    .catch(err => console.error('❌ DB sync error:', err));
}

module.exports = app;