const router = require('./router');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// set template engine
app.set('views', 'views');
app.set('view engine', 'ejs');

// serve static file and parse body
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', router);

app.listen(process.env.PORT, () =>
  console.log(`app running on port ${process.env.PORT}`)
);
