exports.handle404Code = (req, res, next) => {
  res.status(404).send({ msg: 'Invalid Path' });
};

exports.handle500Code = (err, req, res, next) => {
  res.status(500).send({ msg: 'We made a server error :(' });
};
