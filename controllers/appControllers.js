const {
  getAllCategories,
  getAllReviews,
  getReviewById,
  postCommentByReviewId,
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

exports.sendCommentByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  console.log(req.params);
  const { username, body } = req.body;
  console.log(req.body);
  postCommentByReviewId(review_id, username, body)
    .then((comment) => {
      console.log(comment);
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
