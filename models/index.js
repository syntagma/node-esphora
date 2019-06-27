const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const models = {};
const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston');
const goodWinston = require('hapi-good-winston').goodWinston;

global.logger = winston.createLogger({
  level: 'info',
  // format: winston.format.json(),
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()]
});

if (config.get('mongo.db_host') != '') {
  let files = fs
    .readdirSync(__dirname)
    .filter(file => {
      return (
        file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
      );
    })
    .forEach(file => {
      var filename = file.split('.')[0];
      var model_name = filename.charAt(0).toUpperCase() + filename.slice(1);
      models[model_name] = require('./' + file);
    });

  mongoose.Promise = global.Promise; //set mongo up to use promises
  const mongo_location =
    'mongodb://' +
    config.get('mongo.db_user') +
    ':' +
    config.get('mongo.db_password') +
    '@' +
    config.get('mongo.db_host') +
    ':' +
    config.get('mongo.db_port') +
    '/' +
    config.get('mongo.db_name');

  mongoose.set('debug', config.get('mongo.debug'));
  mongoose.set('useCreateIndex', true);
  mongoose
    .connect(mongo_location, {
      useNewUrlParser: true
    })
    .catch(err => {
      logger.error('*** Can Not Connect to Mongo Server:', mongo_location);
    });

  mongoose.set('useCreateIndex', true);

  let db = mongoose.connection;
  module.exports = db;
  db.once('open', () => {
    logger.info('Connected to mongo at ' + mongo_location);
  });
  db.on('error', error => {
    logger.error('error', error);
  });
  // End of Mongoose Setup
} else {
  logger.error('No Mongo Credentials Given');
}

module.exports = models;
