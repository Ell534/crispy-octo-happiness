const express = require('express');
const app = express();
const { fetchAllCategories, fetchAllReviews } = require('./controllers/appControllers');
const {
  handle500Code,
  handle404PathNotFound,
} = require('./controllers/errorControllers');


app.get('/api/categories', fetchAllCategories);

app.get('/api/reviews', fetchAllReviews);


app.use(handle404PathNotFound);
app.use(handle500Code);

module.exports = app;