const express = require('express');
const app = express();
const {
  fetchAllCategories,
  fetchAllReviews,
  fetchReviewById,
  sendCommentByReviewId,
} = require('./controllers/appControllers');
const {
  handle500Code,
  handle404PathNotFound,
  handleCustomErrors,
  handlePSQL400s,
} = require('./controllers/errorControllers');

app.use(express.json());

app.get('/api/categories', fetchAllCategories);

app.get('/api/reviews', fetchAllReviews);

app.get('/api/reviews/:review_id', fetchReviewById);

app.post('/api/reviews/:review_id/comments', sendCommentByReviewId);

app.use(handleCustomErrors);
app.use(handlePSQL400s);
app.use(handle404PathNotFound);
app.use(handle500Code);

module.exports = app;
