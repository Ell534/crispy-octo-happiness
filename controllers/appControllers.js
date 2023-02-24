const {
  getAllCategories,
  getAllReviews,
  getAllUsers,
  getReviewById,
  getCommentsByReviewId,
  postCommentByReviewId,
  patchReviewById,
  deleteCommentById,
} = require('../models/appModels');

exports.fetchAllCategories = (req, res, next) => {
  getAllCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};

exports.fetchAllReviews = (req, res, next) => {
  const { category, sort_by, order } = req.query;
  getAllReviews(category, sort_by, order)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.fetchAllUsers = (req, res, next) => {
  getAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.fetchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  getReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.fetchCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  getCommentsByReviewId(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.sendCommentByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const { username, body } = req.body;
  postCommentByReviewId(review_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  patchReviewById(inc_votes, review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.removeCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
