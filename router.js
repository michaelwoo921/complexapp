const express = require('express');
const userCtrl = require('./controllers/userController');

const router = express.Router();

router.get('/', userCtrl.home);

router.post('/login', userCtrl.login);
router.post('/register', userCtrl.register);

module.exports = router;
