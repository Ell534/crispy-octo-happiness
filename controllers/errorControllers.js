exports.handle404PathNotFound = (req, res, next) => {
  res.status(404).send({ msg: 'Path not found' });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err === 'review id not present') {
    res.status(404).send({ msg: 'This review ID does not Exist' });
  } else {
    next(err);
  }
};

exports.handle500Code = (err, req, res, next) => {
  res.status(500).send({ msg: 'We made a server error :(' });
};
