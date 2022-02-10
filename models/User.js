const validator = require('validator');
const bcrypt = require('bcryptjs');
const md5 = require('md5');
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
  return new Promise(async (resolve, reject) => {
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

    // if username is valid check if username is already taken
    if (
      this.data.username.length > 2 &&
      this.data.username.length < 31 &&
      validator.isAlphanumeric(this.data.username)
    ) {
      let usernameExists = await usersCollection.findOne({
        username: this.data.username,
      });
      if (usernameExists) {
        this.errors.push('That username is already taken');
      }
    }
    // if email is valid check if it is already taken
    if (validator.isEmail(this.data.email)) {
      let emailExists = await usersCollection.findOne({
        email: this.data.email,
      });
      if (emailExists) {
        this.errors.push('That email is already being used');
      }
    }

    resolve();
  });
};

User.prototype.register = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    await this.validate();

    if (!this.errors.length) {
      // hash password then save user to databse
      const salt = bcrypt.genSaltSync(10);
      this.data.password = bcrypt.hashSync(this.data.password, salt);

      // add data to database
      await usersCollection.insertOne(this.data);
      this.getAvatar();
      resolve();
    }
    reject(this.errors);
  });
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
          this.data = attemptedUser;

          this.getAvatar();
          resolve('congrats ..');
        } else {
          reject('invalid username/password');
        }
      })
      .catch(() => reject('please try again later'));
  });
};

User.prototype.getAvatar = function () {
  this.avatar = `https://gravatar.com/avatar/${md5(
    this.data.email
  )}?s=128&r=pg&d=404`;
};

module.exports = User;
