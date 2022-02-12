const express = require('express');
const userCtrl = require('./controllers/userController');
const postCtrl = require('./controllers/postController');
const followCtrl = require('./controllers/followController');

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
  userCtrl.sharedProfileData,
  userCtrl.profilePostsScreen
);

// post related routes
router.get('/create-post', userCtrl.mustBeLoggedIn, postCtrl.viewCreateScreen);
router.post('/create-post', userCtrl.mustBeLoggedIn, postCtrl.create);
router.get('/post/:id', postCtrl.viewSingle);
router.get('/post/:id/edit', userCtrl.mustBeLoggedIn, postCtrl.viewEditScreen);
router.post('/post/:id/edit', userCtrl.mustBeLoggedIn, postCtrl.edit);
router.post('/post/:id/delete', userCtrl.mustBeLoggedIn, postCtrl.delete);
router.post('/search', postCtrl.search);

// follow related routes
router.post(
  '/addFollow/:username',
  userCtrl.mustBeLoggedIn,
  followCtrl.addFollow
);
router.post(
  '/removeFollow/:username',
  userCtrl.mustBeLoggedIn,
  followCtrl.removeFollow
);

module.exports = router;
