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

exports.getCommentsByReviewId = (reviewId) => {
  return db
    .query(
      `SELECT *
    FROM comments
    WHERE review_id = $1
    ORDER BY created_at DESC;`,
      [reviewId]
    )
    .then(({rows : comments}) => {
      return comments;
    });
};
