const Post = require('../models/Post');

exports.viewCreateScreen = function (req, res) {
  res.render('create-post');
};

exports.create = function (req, res) {
  // get data from body then save to post collection
  const post = new Post(req.body, req.session.user._id);
  post
    .create()
    .then(() => {
      console.log(post.data);
      res.send('new post created');
    })
    .catch((errors) => {
      res.send(errors);
    });
};
