const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Seat = sequelize.define('Seat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  row: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  seatType: {
    type: DataTypes.ENUM('standard', 'vip'),
    defaultValue: 'standard',
  },
}, {
  timestamps: false,
});

module.exports = Seat;
