const Post = require('../models/Post');

exports.viewCreateScreen = function (req, res) {
  res.render('create-post');
};

exports.create = function (req, res) {
  // get data from body then save to post collection
  const post = new Post(req.body, req.session.user._id);
  post
    .create()
    .then((newId) => {
      req.flash('success', 'New post successfully created');
      req.session.save(() => res.redirect(`/post/${newId}`));
    })
    .catch((errors) => {
      errors.forEach((error) => req.flash('errors', error));
      req.session.save(() => res.redirect('/create-post'));
    });
};

exports.apiCreate = function (req, res) {
  // get data from body then save to post collection
  const post = new Post(req.body, req.apiUser._id);
  post
    .create()
    .then((newId) => {
      res.json('congrat');
    })
    .catch((errors) => {
      res.json(errors);
    });
};

exports.viewSingle = async function (req, res) {
  try {
    const post = await Post.findSingleById(req.params.id, req.visitorId);

    res.render('single-post-screen', { post: post, title: post.title });
  } catch {
    res.render('404');
  }
};

exports.viewEditScreen = async function (req, res) {
  console.log('0');
  try {
    let post = await Post.findSingleById(req.params.id, req.visitorId);
    if (post.isVisitorOwner) {
      res.render('edit-post', { post: post });
    } else {
      req.flash('errors', 'You do not have permission to perform that action');
      req.session.save(() => res.redirect('/'));
    }
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

exports.delete = function (req, res) {
  Post.delete(req.params.id, req.visitorId)
    .then(() => {
      req.flash('success', 'Post successfully deleted.');
      req.session.save(() =>
        res.redirect(`/profile/${req.session.user.username}`)
      );
    })
    .catch(() => {
      req.flash('errors', 'You do not have permission to perform that action.');
      req.session.save(() => res.redirect('/'));
    });
};

exports.apiDelete = function (req, res) {
  Post.delete(req.params.id, req.apiUser._id)
    .then(() => {
      res.json('success');
    })
    .catch(() => {
      res.json('you do not have permission');
    });
};

exports.search = function (req, res) {
  Post.search(req.body.searchTerm)
    .then((posts) => {
      res.json(posts);
    })
    .catch(() => {
      res.json([]);
    });
};
