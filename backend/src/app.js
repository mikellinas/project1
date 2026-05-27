const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Security: set safe HTTP headers
app.use(helmet());

// Allow cross-origin requests (frontend on a different port)
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Log every request to the terminal: method, path, status, response time
app.use(morgan('dev'));

// Routes
app.use('/api/health', require('./routes/health'));
app.use('/api/auth', require('./routes/auth'));

// 404 handler — catches any route that doesn't match above
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler — catches errors thrown/passed in route handlers
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

module.exports = app;
