const router = require('./router');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const markdown = require('marked');
const express = require('express');
const sanitizeHTML = require('sanitize-html');

const app = express();
// use session
const sessionOptions = session({
  secret: 'nevergiveup',
  resave: false,
  store: MongoStore.create({
    client: require('./db'),
  }),
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
});

app.use(sessionOptions);
app.use(flash());
app.use(function (req, res, next) {
  // make our markdown function available from within ejs templates
  res.locals.filterUserHTML = function (content) {
    return sanitizeHTML(markdown.parse(content), {
      allowedTags: [
        'p',
        'br',
        'ul',
        'ol',
        'li',
        'strong',
        'bold',
        'i',
        'em',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
      ],
      allowedAttributes: {},
    });
  };

  // make all errors flash message available
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');

  // make current user id available on the req object
  if (req.session.user) {
    req.visitorId = req.session.user._id;
  } else {
    req.visitorId = 0;
  }

  // session user available to views
  res.locals.user = req.session.user;
  next();
});

// set template engine
app.set('views', 'views');
app.set('view engine', 'ejs');

// serve static file and parse body
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', router);

const server = require('http').createServer(app);

const io = require('socket.io')(server);

io.on('connection', function (socket) {
  console.log('new user connected');
  socket.on('chatMessageFromBrowser', function (data) {
    console.log(data.message);
    io.emit('chatMessageFromServer', { message: data.message });
  });
});

module.exports = server;
