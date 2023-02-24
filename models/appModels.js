const db = require('../db/connection');
// const checkExists = require('../db/data/dataUtils');


exports.getAllCategories = () => {
  return db.query(`SELECT * FROM categories;`).then(({ rows: categories }) => {
    return categories;
  });
};

exports.getAllReviews = (
  category,
  sort_by = 'reviews.created_at',
  order = 'desc'
) => {
  let queryStr = `
  SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, CAST(COUNT(comment_id) AS INT) AS comment_count 
  FROM reviews
  LEFT JOIN comments
  ON comments.review_id = reviews.review_id`;
  if (category) {
    queryStr += ` WHERE category = $1`;
  }
  if (
    ![
      'owner',
      'title',
      'reviews.review_id',
      'category',
      'review_img_url',
      'reviews.created_at',
      'reviews.votes',
      'designer',
    ].includes(sort_by)
  ) {
    return Promise.reject('invalid sort query');
  }
  if (!['asc', 'desc'].includes(order)) {
    return Promise.reject('invalid order query');
  } else if (!category) {
    queryStr += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`;
    return db.query(queryStr).then(({ rows: reviews }) => {
      return reviews;
    });
  } else {
    queryStr += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`;
    return db
      .query(`SELECT * FROM categories WHERE slug = $1`, [category])
      .then((result) => {
        const regex = /[\d]+/g;
        if (result.rowCount === 0) {
          if (!regex.test(category)) {
            return Promise.reject('no category');
          } else {
            return Promise.reject('invalid category');
          }
        }
        return db.query(queryStr, [category]).then(({ rows: reviews }) => {
          return reviews;
        });
      });
  }
};

exports.getAllUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows: users }) => {
    return users;
  });
};

exports.getReviewById = (review_id) => {
  return db
    .query(
      `SELECT owner, title, reviews.review_id, category, review_img_url, review_body, reviews.created_at, reviews.votes, designer, CAST(COUNT(comment_id) AS INT) AS comment_count FROM reviews
LEFT JOIN comments
ON comments.review_id = reviews.review_id
WHERE reviews.review_id = $1
GROUP BY reviews.review_id
ORDER BY reviews.created_at DESC;`,
      [review_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject('id not present');
      }
      const { rows: review } = result;
      return review;
    });
};

exports.getCommentsByReviewId = (reviewId) => {
  return db
    .query(
      `SELECT *
    FROM reviews
    WHERE review_id = $1;`,
      [reviewId]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject('id not present');
      }
      return db
        .query(
          `SELECT *
        FROM comments
        WHERE review_id = $1
        ORDER BY created_at DESC;`,
          [reviewId]
        )
        .then(({ rows: comments }) => {
          return comments;
        });
    });
};

exports.postCommentByReviewId = (review_id, username, body) => {
  return db
    .query(
      `SELECT *
    FROM reviews
    WHERE review_id = $1;`,
      [review_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject('id not present');
      }
      return db
        .query(
          `INSERT INTO comments (body, review_id, author)
        VALUES 
        ($1, $2, $3) RETURNING *;`,
          [body, review_id, username]
        )
        .then(({ rows }) => {
          return rows[0];
        });
    });
};

exports.patchReviewById = (inc_votes, review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject('id not present');
      }
      return db
        .query(
          `UPDATE reviews
      SET 
      votes = votes + $1
      WHERE review_id = $2
      RETURNING *`,
          [inc_votes, review_id]
        )
        .then(({ rows }) => {
          return rows[0];
        });
    });
};

exports.deleteCommentById = (comment_id) => {
  return db
    .query(
      `DELETE FROM comments
  WHERE comment_id = $1 RETURNING *;`,
      [comment_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject('id not present');
      }
      return null;
    });
};
