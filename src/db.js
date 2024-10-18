const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize('sqlite::memory:');


async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = { sequelize, testConnection };