const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const base64 = require('base-64');
const salesRoutes = require('./routes/sales');

// Create an Express application
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use('/api-new', salesRoutes);

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
