const { getAllCategories } = require('../models/appModels');

exports.fetchAllCategories = (req, res) => {
  getAllCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};
