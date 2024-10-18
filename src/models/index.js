import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalTickets: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  availableTickets: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const WaitingList = sequelize.define('WaitingList', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define relationships
Event.hasMany(Booking);
Booking.belongsTo(Event);

Event.hasMany(WaitingList);
WaitingList.belongsTo(Event);

// Export models
export { Event, Booking, WaitingList };