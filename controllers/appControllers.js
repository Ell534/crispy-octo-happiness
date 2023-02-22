const {
  getAllCategories,
  getAllReviews,
  getCommentsByReviewId,
  getReviewById,
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
  getAllReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
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
