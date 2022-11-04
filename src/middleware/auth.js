module.exports = (req, res, next) => {

  // Can come back later and actually check that this git key works
  if (req.headers.authorization) {
    next();
  } else {
    res.sendStatus(401);
  }
};
