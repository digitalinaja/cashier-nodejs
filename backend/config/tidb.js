const axios = require('axios');
const base64 = require('base-64');

// TiDB REST API configuration
const tidbApiUrl = process.env.TIDB_API_URL || 'http://localhost:4000/api';
const tidbUsername = process.env.TIDB_USERNAME || 'username';
const tidbPassword = process.env.TIDB_PASSWORD || 'password';

// Basic Auth header
const authHeader = `Basic ${base64.encode(`${tidbUsername}:${tidbPassword}`)}`;

const tidbAPI = axios.create({
  baseURL: tidbApiUrl, // Ganti dengan URL TiDB API Anda
  headers: {
    'Authorization': authHeader
  }
});

module.exports = tidbAPI;
