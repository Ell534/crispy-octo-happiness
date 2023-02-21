const { getAllCategories, getAllReviews } = require('../models/appModels');

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
