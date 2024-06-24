const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const base64 = require('base-64');
const basicAuth = require('basic-auth');
const salesRoutes = require('./routes/sales');

// Create an Express application
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Basic Authentication Middleware
const auth = (req, res, next) => {
  const user = basicAuth(req);
  const { name, pass } = user || {};

  const isAuthorized = name === process.env.BASIC_AUTH_USERNAME && pass === process.env.BASIC_AUTH_PASSWORD;

  if (isAuthorized) {
    return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="401"').status(401).send('Authentication required.');
};

//without basic-auth
app.use('/api-new', salesRoutes);

// Routes that do not require authentication
const openRoutes = [
  '/manifest.json',
  '/service-worker.js',
  '/icon.png'
];

app.use((req, res, next) => {
  if (openRoutes.includes(req.path) || req.path.startsWith('/static/')) {
    return next();
  }
  auth(req, res, next);
});

// Apply the auth middleware to all other routes
app.use(auth);

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all handler to serve the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
