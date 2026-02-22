const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Hall = sequelize.define('Hall', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rows: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  seatsPerRow: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Hall;
