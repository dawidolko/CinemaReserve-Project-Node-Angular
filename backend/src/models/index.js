const sequelize = require('../config/database');
const User = require('./User');
const Movie = require('./Movie');
const Hall = require('./Hall');
const Seat = require('./Seat');
const Screening = require('./Screening');
const Reservation = require('./Reservation');
const SiteContent = require('./SiteContent');
const SectionOrder = require('./SectionOrder');

// Hall -> Seats
Hall.hasMany(Seat, { foreignKey: 'hallId', onDelete: 'CASCADE' });
Seat.belongsTo(Hall, { foreignKey: 'hallId' });

// Movie -> Screenings
Movie.hasMany(Screening, { foreignKey: 'movieId', onDelete: 'CASCADE' });
Screening.belongsTo(Movie, { foreignKey: 'movieId' });

// Hall -> Screenings
Hall.hasMany(Screening, { foreignKey: 'hallId', onDelete: 'CASCADE' });
Screening.belongsTo(Hall, { foreignKey: 'hallId' });

// User -> Reservations
User.hasMany(Reservation, { foreignKey: 'userId', onDelete: 'CASCADE' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

// Screening -> Reservations
Screening.hasMany(Reservation, { foreignKey: 'screeningId', onDelete: 'CASCADE' });
Reservation.belongsTo(Screening, { foreignKey: 'screeningId' });

// Seat -> Reservations
Seat.hasMany(Reservation, { foreignKey: 'seatId', onDelete: 'CASCADE' });
Reservation.belongsTo(Seat, { foreignKey: 'seatId' });

// Unique constraint: one seat per screening
Reservation.addHook('beforeCreate', async (reservation) => {
  const existing = await Reservation.findOne({
    where: {
      screeningId: reservation.screeningId,
      seatId: reservation.seatId,
      status: 'confirmed',
    },
  });
  if (existing) {
    throw new Error('This seat is already reserved for this screening');
  }
});

module.exports = {
  sequelize,
  User,
  Movie,
  Hall,
  Seat,
  Screening,
  Reservation,
  SiteContent,
  SectionOrder,
};
