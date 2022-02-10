const router = require('./router');
const express = require('express');

const app = express();

// set template engine
app.set('views', 'views');
app.set('view engine', 'ejs');

// serve static file and parse body
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', router);

module.exports = app;
