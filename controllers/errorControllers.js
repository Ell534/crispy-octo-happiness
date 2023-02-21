exports.handle404PathNotFound = (req, res, next) => {
  res.status(404).send({ msg: 'Path not found' });
};

exports.handle500Code = (err, req, res, next) => {
  res.status(500).send({ msg: 'We made a server error :(' });
};
