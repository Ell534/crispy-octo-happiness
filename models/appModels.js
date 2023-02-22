const db = require('../db/connection');

exports.getAllCategories = () => {
  return db.query(`SELECT * FROM categories;`).then(({ rows: categories }) => {
    return categories;
  });
};

exports.getAllReviews = () => {
  return db
    .query(
      `SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, CAST(COUNT(comment_id) AS INT) AS comment_count FROM reviews
  LEFT JOIN comments
  ON comments.review_id = reviews.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC;`
    )
    .then(({ rows: reviews }) => {
      return reviews;
    });
};

exports.getReviewById = (review_id) => {
  return db
    .query(
      `SELECT 
    review_id, title, review_body, designer,
    review_img_url, votes, category, owner, created_at
    FROM reviews
    WHERE review_id = $1;`,
      [review_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject('review id not present');
      }
      const { rows: review } = result;
      return review;
    });
};

exports.getCommentsByReviewId = (reviewId) => {
  return db
    .query(
      `SELECT *
      FROM comments
      WHERE review_id = $1
      ORDER BY created_at DESC;`,
      [reviewId]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject('review id not present')
      }
      const { rows: comments } = result
      return comments;
    });
};
