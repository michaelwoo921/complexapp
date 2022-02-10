const postsCollection = require('../db').db().collection('posts');
const ObjectId = require('mongodb').ObjectId;

const Post = function (data, userid) {
  this.data = data;
  this.errors = [];
  this.userid = userid;
};

Post.prototype.cleanUp = function () {
  if (typeof this.data.title != 'string') {
    this.data.title = '';
  }
  if (typeof this.data.body != 'string') {
    this.data.body = '';
  }
  // remove bogus properties
  this.data = {
    title: this.data.title.trim(),
    body: this.data.body.trim(),
    createdDate: new Date(),
    author: ObjectId(this.userid),
  };
};

Post.prototype.validate = function () {
  if (this.data.title == '') {
    this.errors.push('You must provide a title.');
  }
  if (this.data.body == '') {
    this.errors.push('You must provide post content.');
  }
};

Post.prototype.create = function () {
  return new Promise((resolve, reject) => {
    // clean up and validate data
    this.cleanUp();
    this.validate();
    if (this.errors.length == 0) {
      // save post to posts collection

      postsCollection
        .insertOne(this.data)
        .then(() => {
          resolve();
        })
        .catch(() => {
          this.errors.push('Please try again later');
          reject(this.errors);
        });
    } else {
      reject(this.errors);
    }
  });
};
module.exports = Post;
