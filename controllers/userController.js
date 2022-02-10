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
  user.login();
  res.send('trying to login');
};

const home = function (req, res) {
  res.render('home-guest');
};

module.exports = { register, login, home };
