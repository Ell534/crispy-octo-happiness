const express = require('express');
const app = express();
const { fetchAllCategories, fetchAllReviews, fetchCommentsByReviewId } = require('./controllers/appControllers');
const {
  handle500Code,
  handle404PathNotFound,
} = require('./controllers/errorControllers');


app.get('/api/categories', fetchAllCategories);

app.get('/api/reviews', fetchAllReviews);


app.get('/api/reviews/:review_id/comments', fetchCommentsByReviewId)

app.use(handle404PathNotFound);
app.use(handle500Code);

module.exports = app;