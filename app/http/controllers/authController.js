const User = require("../../models/user");
const passport = require("passport");

//global variables
const authController = () => {
  const _getRedirectUrl = (req) => {
    return req.query.state=== "admin" ? "/admin/orders" : "/";
    // factory functions
  };

  return {
    login: ((req, res) => {
      res.render("auth/login");
    }),
    google: ((req, res, next) => passport.authenticate('google', {
      scope: ['profile', 'email'],
      state: req.query.role
    }, () => next())(req, res, next)),
    google_call :((req, res) => passport.authenticate('google', {
          successRedirect : _getRedirectUrl(req),
          failureRedirect: '/login', failureMessage: true
      })(req, res))
    ,
    logout :((req, res, next) => {
      req.logout((error) => {
          if (error) {return next(error)}
          res.redirect('/')
      })
    })
  };
};

module.exports = authController;
