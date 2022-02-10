const validator = require('validator');
const bcrypt = require('bcryptjs');
const usersCollection = require('../db').db().collection('users');

const User = function (data) {
  this.data = data;
  this.errors = [];
};

User.prototype.cleanUp = function () {
  // accept data of only string type
  if (typeof this.data.username != 'string') {
    this.data.username = '';
  }
  if (typeof this.data.email != 'string') {
    this.data.email = '';
  }
  if (typeof this.data.password != 'string') {
    this.data.password = '';
  }

  // remove bogus properties
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password,
  };
};

User.prototype.validate = function () {
  console.log('data after cleanUp', this.data);
  if (this.data.username == '') {
    this.errors.push('You must provide a username');
  }
  if (
    this.data.username != '' &&
    !validator.isAlphanumeric(this.data.username)
  ) {
    this.errors.push('username can contain only letters or numbers.');
  }
  if (!validator.isEmail(this.data.email)) {
    this.errors.push('You must provide a valid email');
  }
  if (this.data.password == '') {
    this.errors.push('You must provide a password');
  }

  if (this.data.password.length > 0 && this.data.password.length < 12) {
    this.errors.push('Password must be at least 12 characters.');
  }

  if (this.data.password.length > 50) {
    this.errors.push('Password cannot exceed 50 characters.');
  }

  if (this.data.username.length > 0 && this.data.username.length < 3) {
    this.errors.push('username must be at least 3 characters.');
  }

  if (this.data.username.length > 30) {
    this.errors.push('username cannot exceed 30 characters.');
  }
};

User.prototype.register = function () {
  this.cleanUp();
  this.validate();

  if (!this.errors.length) {
    // hash password then save user to databse
    const salt = bcrypt.genSaltSync(10);
    this.data.password = bcrypt.hashSync(this.data.password, salt);
    console.log('insert data to database');
    console.log(this.data, this.errors);
    // add data to database
    usersCollection.insertOne(this.data);
  }
};

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    usersCollection
      .findOne({ username: this.data.username })
      .then((attemptedUser) => {
        if (
          attemptedUser &&
          bcrypt.compareSync(this.data.password, attemptedUser.password)
        ) {
          resolve('congrats ..');
        } else {
          reject('invalid username/password');
        }
      })
      .catch(() => reject('please try again later'));
  });
};

module.exports = User;
