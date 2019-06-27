const mongooseLib = require('mongoose');
const config = require('config');
const UsersSeeder = require('./seeders/users.seeder');
const TrucksSeeder = require('./seeders/trucks.seeder');
const PurchasesSeeder = require('./seeders/purchases.seeder');
const SalesSeeder = require('./seeders/sales.seeder');
const CustomersSeeder = require('./seeders/customers.seeder');
const ExchateRatesSeeder = require('./seeders/exchangeRates.seeder');
const winston = require('winston');

global.logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()]
});

mongooseLib.Promise = global.Promise || Promise;

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

module.exports = {
  mongoose: mongooseLib,
  mongoURL: mongo_location,
  seedersList: {
    Users: UsersSeeder,
    Purchases: PurchasesSeeder,
    Trucks: TrucksSeeder,
    Customers: CustomersSeeder,
    Sales: SalesSeeder,
    ExchangeRates: ExchateRatesSeeder
  }
};
