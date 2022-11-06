const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./app/api/routes/user_routes');
const CONFIG = require('./app/api/config/config');
const connectToDb = require('./app/api/Db/mongodb');
const errorHandler = require('./app/api/controllers/error_controllers');

const app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CONNECT to MongoDB
connectToDb();

app.use('/api/users', users);

app.get('/', function (req, res) {
  res.json({ tutorial: 'Build REST API with node.js' });
});

app.use(errorHandler);

app.listen(CONFIG.PORT, () => {
  console.log('Node server listening on port 3000');
});
