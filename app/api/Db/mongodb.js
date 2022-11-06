const mongoose = require('mongoose');
const CONFIG = require('../config/config');
// const logger = require("../logging/logger")

function connectToDb() {
  mongoose.connect(CONFIG.MONGODB_URL);

  mongoose.connection.on('connected', () => {
    console.log('Mongodb connected successfully');
  });

  mongoose.connection.on('error', (err) => {
    console.error(err);
  });
}

module.exports = connectToDb;
