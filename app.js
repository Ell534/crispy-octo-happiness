const express = require('express');
const app = express();
const { fetchAllCategories } = require('./controllers/appControllers');
const {
  handle500Code,
  handle404Code,
} = require('./controllers/errorControllers');


app.get('/api/categories', fetchAllCategories);


app.use(handle404Code);
app.use(handle500Code);

module.exports = app;
// app.all('*', handle404Code); ignore