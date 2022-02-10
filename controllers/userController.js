const User = require('../models/User');

const register = function (req, res) {
  const user = new User(req.body);
  user.register();
  if (user.errors.length > 0) {
    res.send(user.errors);
  } else {
    res.send('Congrats, there are no errors');
  }
};

const login = function (req, res) {
  const user = new User(req.body);
  user
    .login()
    .then((result) => {
      req.session.user = { username: user.data.username, favColor: 'blue' };
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
    res.render('home-dashboard', { username: req.session.user.username });
  } else {
    res.render('home-guest', { errors: req.flash('errors') });
  }
};

module.exports = { register, login, logout, home };
