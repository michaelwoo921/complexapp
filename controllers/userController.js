const User = require('../models/User');

const register = function (req, res) {
  const user = new User(req.body);
  user
    .register()
    .then(() => {
      req.session.user = {
        username: user.data.username,
        avatar: user.avatar,
      };
      req.session.save(function () {
        res.redirect('/');
      });
    })
    .catch((regErrors) => {
      regErrors.forEach((error) => req.flash('regErrors', error));
      req.session.save(function () {
        res.redirect('/');
      });
    });
};

const login = function (req, res) {
  const user = new User(req.body);
  user
    .login()
    .then((result) => {
      req.session.user = {
        username: user.data.username,
        avatar: user.avatar,
      };
      req.session.save(() => {
        res.redirect('/');
      });
    })
    .catch((e) => {
      req.flash('errors', e);
      req.session.save(() => {
        res.redirect('/');
      });
    });
};

const logout = function (req, res) {
  req.session.destroy(function () {
    res.redirect('/');
  });
};

const home = function (req, res) {
  if (req.session.user) {
    console.log(req.session.user);
    res.render('home-dashboard', {
      username: req.session.user.username,
      avatar: req.session.user.avatar,
    });
  } else {
    res.render('home-guest', {
      errors: req.flash('errors'),
      regErrors: req.flash('regErrors'),
    });
  }
};

module.exports = { register, login, logout, home };
