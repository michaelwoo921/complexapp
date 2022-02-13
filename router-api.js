const apiRouter = require('express').Router();
const userCtrl = require('./controllers/userController');
const postCtrl = require('./controllers/postController');
const followCtrl = require('./controllers/followController');
const cors = require('cors');

apiRouter.use(cors());

apiRouter.post('/login', userCtrl.apiLogin);
apiRouter.post('/create-post', userCtrl.apiMustBeLoggedIn, postCtrl.apiCreate);
apiRouter.delete('/post/:id', userCtrl.apiMustBeLoggedIn, postCtrl.apiDelete);
apiRouter.get('/postsByAuthor/:username', userCtrl.apiGetPostsByUsername);

module.exports = apiRouter;
