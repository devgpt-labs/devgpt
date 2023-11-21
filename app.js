const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3999;

// Import routes
const routes = require('./routes');

// Middleware for parsing JSON and URL-encoded forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Use routes
app.use(routes);

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `);
});

// Export the Express API
module.exports = app;
