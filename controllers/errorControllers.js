exports.handle404PathNotFound = (req, res, next) => {
  res.status(404).send({ msg: 'Path not found' });
};

exports.handlePSQL400s = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad Request' });
  } else if (err.code === '23502') {
    res.status(400).send({ msg: 'Malformed Request' });
  } else if (err.code === '23503') {
    res.status(400).send({ msg: 'Invalid User' });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err === 'id not present') {
    res.status(404).send({ msg: 'This review ID does not exist' });
  } else if (err === 'no category') {
    res.status(404).send({ msg: 'This category does not exist' });
  } else if (err === 'invalid sort query') {
    res.status(400).send({ msg: 'Bad Request' });
  } else if (err === 'invalid order query') {
    res.status(400).send({ msg: 'Bad Request' });
  } else {
    next(err);
  }
};

exports.handle500Code = (err, req, res, next) => {
  res.status(500).send({ msg: 'We made a server error :(' });
};
