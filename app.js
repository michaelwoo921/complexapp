const router = require('./router');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const express = require('express');

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

// set template engine
app.set('views', 'views');
app.set('view engine', 'ejs');

// serve static file and parse body
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', router);

module.exports = app;
