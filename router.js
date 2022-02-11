const express = require('express');
const userCtrl = require('./controllers/userController');
const postCtrl = require('./controllers/postController');

const router = express.Router();

// user related routes
router.get('/', userCtrl.home);
router.post('/login', userCtrl.login);
router.post('/register', userCtrl.register);
router.post('/logout', userCtrl.logout);

// profile related routes
router.get(
  '/profile/:username',
  userCtrl.ifUserExists,
  userCtrl.profilePostsScreen
);

// post related routes
router.get('/create-post', userCtrl.mustBeLoggedIn, postCtrl.viewCreateScreen);
router.post('/create-post', userCtrl.mustBeLoggedIn, postCtrl.create);
router.get('/post/:id', postCtrl.viewSingle);

module.exports = router;
