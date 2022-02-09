const User = require('../models/User');

const register = function (req, res) {
  const user = new User(req.body);
  user.register();
  res.send('thnak you for registering');
};

const login = function (req, res) {
  const user = new User(req.body);
  user.login();
  res.send('trying to login');
};

const home = function (req, res) {
  res.render('home-guest');
};

module.exports = { register, login, home };
