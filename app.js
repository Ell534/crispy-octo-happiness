const express = require('express');
const app = express();
const {
  fetchAllCategories,
  fetchAllReviews,
  fetchReviewById,
} = require('./controllers/appControllers');
const {
  handle500Code,
  handle404PathNotFound,
  handleCustomErrors,
} = require('./controllers/errorControllers');

app.get('/api/categories', fetchAllCategories);

app.get('/api/reviews', fetchAllReviews);

app.get('/api/reviews/:review_id', fetchReviewById);

app.use(handleCustomErrors);
app.use(handle404PathNotFound);
app.use(handle500Code);

module.exports = app;
