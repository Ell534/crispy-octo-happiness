const express = require('express');
const app = express();
const { fetchAllCategories } = require('./controllers/appControllers');

app.get('/api/categories', fetchAllCategories);

module.exports = app;
