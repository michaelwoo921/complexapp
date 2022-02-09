const User = function (data) {
  this.data = data;
};

User.prototype.register = function () {
  console.log('data', this.data);
};

User.prototype.login = function () {
  console.log(this.data);
};

module.exports = User;
