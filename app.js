const express = require('express');
const app = express();
const cors = require('cors');

const {
  fetchEndpointsJson,
  fetchAllCategories,
  fetchAllReviews,
  fetchAllUsers,
  fetchReviewById,
  fetchCommentsByReviewId,
  sendCommentByReviewId,
  updateReviewById,
  removeCommentById,
} = require('./controllers/appControllers');

const {
  handle500Code,
  handle404PathNotFound,
  handleCustomErrors,
  handlePSQL400s,
} = require('./controllers/errorControllers');

app.use(cors());

app.use(express.json());

app.get('/api', fetchEndpointsJson);

app.get('/api/categories', fetchAllCategories);

app.get('/api/reviews', fetchAllReviews);

app.get('/api/users', fetchAllUsers);

app.get('/api/reviews/:review_id', fetchReviewById);

app.get('/api/reviews/:review_id/comments', fetchCommentsByReviewId);

app.post('/api/reviews/:review_id/comments', sendCommentByReviewId);

app.patch('/api/reviews/:review_id', updateReviewById);

app.delete('/api/comments/:comment_id', removeCommentById);

app.use(handleCustomErrors);
app.use(handlePSQL400s);
app.use(handle404PathNotFound);
app.use(handle500Code);

module.exports = app;
