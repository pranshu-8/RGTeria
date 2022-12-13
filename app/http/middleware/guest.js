function guest(req, res, next) {
  console.log(req.query)
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/");
}

module.exports = guest;
