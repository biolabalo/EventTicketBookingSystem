const express = require('express');
const { sequelize, testConnection } = require('./db');
const { Event, Booking, WaitingList } = require('./models');

const app = express();

app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Event Ticket Booking System API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Function to start the server
async function startServer() {
  try {
    await testConnection();
    await sequelize.sync();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
}

// Only start the server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = app;