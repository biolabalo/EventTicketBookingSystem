import express from 'express';
import bodyParser from 'body-parser';
import eventRoutes from './routes/index.js'; 
import { sequelize, testConnection } from './db.js';

const app = express();

app.use(express.json());
app.use(bodyParser.json());


// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Event Ticket Booking System API' });
});

app.use('/api', eventRoutes);


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


startServer();

export default app;

