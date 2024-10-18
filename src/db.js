const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize('sqlite::memory:');
const logger = require("./utils/logger");


async function testConnection() {
  try {
    await sequelize.authenticate();
    logger.info('Connection to the database has been established successfully.')
  } catch (error) {
    logger.error('Unable to connect to the database:', error)
  }
}

module.exports = { sequelize, testConnection };