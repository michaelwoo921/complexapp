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

exports.viewSingle = async function (req, res) {
  try {
    const post = await Post.findSingleById(req.params.id, req.visitorId);

    res.render('single-post-screen', { post: post });
  } catch {
    res.render('404');
  }
};

exports.viewEditScreen = async function (req, res) {
  try {
    let post = await Post.findSingleById(req.params.id);

    res.render('edit-post', { post: post });
  } catch {
    res.render('404');
  }
};

exports.edit = function (req, res) {
  const post = new Post(req.body, req.visitorId, req.params.id);

  post
    .update()
    .then((status) => {
      console.log(status);
      if (status == 'success') {
        req.flash('success', 'Post successfully updated');
        req.session.save(() => res.redirect(`/post/${req.params.id}/edit`));
      } else {
        post.errors.forEach((e) => {
          req.flash('errors', e);
        });
        req.session.save(() => res.redirect(`/post/${req.params.id}/edit`));
      }
    })
    .catch(() => {
      // post with requestId does not exist or
      // current visitor is not the owner of the reuqested post
      req.flash('errors', 'You do not have permission to perform that action');
      req.session.save(() => res.redirect('/'));
    });
};
