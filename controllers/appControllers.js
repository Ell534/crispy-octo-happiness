const {
  getAllCategories,
  getAllReviews,
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

exports.fetchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  getReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
      console.log({ review });
    })
    .catch((err) => {
      next(err);
    });
};
