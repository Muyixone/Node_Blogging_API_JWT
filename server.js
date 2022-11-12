const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./app/api/routes/user_routes');
const blogs = require('./app/api/routes/blog_route');
const CONFIG = require('./app/api/config/config');
const connectToDb = require('./app/api/Db/mongodb');
const errorHandler = require('./app/api/controllers/error_controllers');
const serverError = require('././app/api/utilities/serverError');

const app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CONNECT to MongoDB
connectToDb();

app.use('/api/users', users);
app.use('/api/blogs', blogs);

app.get('/api', function (req, res) {
  return res
    .status(201)
    .json({ test_page: 'A step further to becoming a worldclass developer' });
});

//Undefined route error handler
app.all('*', function (req, res, next) {
  next(new serverError('Undefined route, page not found.', 404));
});

//HANDLE ERROR
app.use(errorHandler);

app.listen(CONFIG.PORT, () => {
  console.log('Node server listening on port 3000');
});
