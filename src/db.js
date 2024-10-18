import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from './utils/logger.js'; // Ensure the correct path and extension

dotenv.config();

const sequelize = new Sequelize('sqlite::memory:');

async function testConnection() {
  try {
    await sequelize.authenticate();
    logger.info('Connection to the database has been established successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
  }
}

export { sequelize, testConnection };