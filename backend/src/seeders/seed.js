const { sequelize, User, Movie, Hall, Seat, Screening, SiteContent, SectionOrder } = require('../models');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Seeder: Database connected.');

    await sequelize.sync({ force: true });
    console.log('Seeder: Tables recreated.');

    // ==================== USERS ====================
    const users = await User.bulkCreate([
      { email: 'admin@cinema.pl', password: 'Admin123!', firstName: 'Jan', lastName: 'Kowalski', role: 'admin' },
      { email: 'manager@cinema.pl', password: 'Manager123!', firstName: 'Anna', lastName: 'Nowak', role: 'admin' },
      { email: 'jan.wisniewski@email.pl', password: 'User123!', firstName: 'Jan', lastName: 'Wiśniewski', role: 'user' },
      { email: 'maria.wojcik@email.pl', password: 'User123!', firstName: 'Maria', lastName: 'Wójcik', role: 'user' },
      { email: 'piotr.kaminski@email.pl', password: 'User123!', firstName: 'Piotr', lastName: 'Kamiński', role: 'user' },
      { email: 'katarzyna.lewandowska@email.pl', password: 'User123!', firstName: 'Katarzyna', lastName: 'Lewandowska', role: 'user' },
      { email: 'tomasz.zielinski@email.pl', password: 'User123!', firstName: 'Tomasz', lastName: 'Zieliński', role: 'user' },
      { email: 'agnieszka.szymanska@email.pl', password: 'User123!', firstName: 'Agnieszka', lastName: 'Szymańska', role: 'user' },
      { email: 'marcin.wozniak@email.pl', password: 'User123!', firstName: 'Marcin', lastName: 'Woźniak', role: 'user' },
      { email: 'ewa.dabrowski@email.pl', password: 'User123!', firstName: 'Ewa', lastName: 'Dąbrowska', role: 'user' },
      { email: 'krzysztof.kozlowski@email.pl', password: 'User123!', firstName: 'Krzysztof', lastName: 'Kozłowski', role: 'user' },
      { email: 'malgorzata.jankowska@email.pl', password: 'User123!', firstName: 'Małgorzata', lastName: 'Jankowska', role: 'user' },
    ], { individualHooks: true });
    console.log(`Seeder: Created ${users.length} users.`);

    // ==================== MOVIES (Real titles with TMDB posters) ====================
    const movies = await Movie.bulkCreate([
      {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
        posterUrl: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
        duration: 148,
        genre: 'Sci-Fi',
        director: 'Christopher Nolan',
        releaseDate: '2010-07-16',
      },
      {
        title: 'Interstellar',
        description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
        posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        duration: 169,
        genre: 'Sci-Fi',
        director: 'Christopher Nolan',
        releaseDate: '2014-11-07',
      },
      {
        title: 'The Dark Knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911BOlluX5OCNlT.jpg',
        duration: 152,
        genre: 'Action',
        director: 'Christopher Nolan',
        releaseDate: '2008-07-18',
      },
      {
        title: 'Dune: Part Two',
        description: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe.',
        posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nez7.jpg',
        duration: 166,
        genre: 'Sci-Fi',
        director: 'Denis Villeneuve',
        releaseDate: '2024-03-01',
      },
      {
        title: 'Oppenheimer',
        description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
        posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        duration: 180,
        genre: 'Drama',
        director: 'Christopher Nolan',
        releaseDate: '2023-07-21',
      },
      {
        title: 'Spider-Man: Across the Spider-Verse',
        description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
        posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
        duration: 140,
        genre: 'Animation',
        director: 'Joaquim Dos Santos',
        releaseDate: '2023-06-02',
      },
      {
        title: 'Joker',
        description: 'During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic crime figure.',
        posterUrl: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
        duration: 122,
        genre: 'Drama',
        director: 'Todd Phillips',
        releaseDate: '2019-10-04',
      },
      {
        title: 'Parasite',
        description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
        posterUrl: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
        duration: 132,
        genre: 'Thriller',
        director: 'Bong Joon-ho',
        releaseDate: '2019-05-30',
      },
      {
        title: 'Avatar: The Way of Water',
        description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
        posterUrl: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
        duration: 192,
        genre: 'Sci-Fi',
        director: 'James Cameron',
        releaseDate: '2022-12-16',
      },
      {
        title: 'Top Gun: Maverick',
        description: 'After thirty years of service as one of the Navy\'s top aviators, Pete "Maverick" Mitchell is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him.',
        posterUrl: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DG3wJvF.jpg',
        duration: 130,
        genre: 'Action',
        director: 'Joseph Kosinski',
        releaseDate: '2022-05-27',
      },
      {
        title: 'Everything Everywhere All at Once',
        description: 'A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have led.',
        posterUrl: 'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
        duration: 139,
        genre: 'Sci-Fi',
        director: 'Daniel Kwan',
        releaseDate: '2022-03-25',
      },
      {
        title: 'The Batman',
        description: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city\'s hidden corruption and question his family\'s involvement.',
        posterUrl: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
        duration: 176,
        genre: 'Action',
        director: 'Matt Reeves',
        releaseDate: '2022-03-04',
      },
      {
        title: 'Guardians of the Galaxy Vol. 3',
        description: 'Still reeling from the loss of Gamora, Peter Quill rallies his team to defend the universe and one of their own. A mission that could mean the end of the Guardians if not successful.',
        posterUrl: 'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg',
        duration: 150,
        genre: 'Action',
        director: 'James Gunn',
        releaseDate: '2023-05-05',
      },
      {
        title: 'John Wick: Chapter 4',
        description: 'John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe.',
        posterUrl: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7BelEJFBEccD.jpg',
        duration: 169,
        genre: 'Action',
        director: 'Chad Stahelski',
        releaseDate: '2023-03-24',
      },
      {
        title: 'Barbie',
        description: 'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.',
        posterUrl: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
        duration: 114,
        genre: 'Comedy',
        director: 'Greta Gerwig',
        releaseDate: '2023-07-21',
      },
      {
        title: 'Wonka',
        description: 'Armed with nothing but a hatful of dreams, young chocolatier Willy Wonka manages to change the world, one delectable bite at a time.',
        posterUrl: 'https://image.tmdb.org/t/p/w500/qhb1qOilapbapxWQn9jtRCMwXJF.jpg',
        duration: 116,
        genre: 'Comedy',
        director: 'Paul King',
        releaseDate: '2023-12-15',
      },
      {
        title: 'Gladiator II',
        description: 'Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius is forced to enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome.',
        posterUrl: 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
        duration: 148,
        genre: 'Action',
        director: 'Ridley Scott',
        releaseDate: '2024-11-22',
      },
      {
        title: 'Inside Out 2',
        description: 'Follow Riley in her teenage years as new emotions join the mix, including Anxiety, Envy, Ennui, and Embarrassment, disrupting the balance Joy and the other original emotions have maintained.',
        posterUrl: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
        duration: 100,
        genre: 'Animation',
        director: 'Kelsey Mann',
        releaseDate: '2024-06-14',
      },
      {
        title: 'Deadpool & Wolverine',
        description: 'Deadpool\'s peaceful existence comes crashing down when the Time Variance Authority recruits him to help safeguard the multiverse. He soon joins forces with his would-be pal, Wolverine, to complete the mission.',
        posterUrl: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
        duration: 128,
        genre: 'Action',
        director: 'Shawn Levy',
        releaseDate: '2024-07-26',
      },
      {
        title: 'Furiosa: A Mad Max Saga',
        description: 'The origin story of the mighty warrior Furiosa before she teamed up with Mad Max in Fury Road. Snatched from the Green Place of Many Mothers, young Furiosa falls into the hands of the great Biker Horde.',
        posterUrl: 'https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg',
        duration: 148,
        genre: 'Action',
        director: 'George Miller',
        releaseDate: '2024-05-24',
      },
    ]);
    console.log(`Seeder: Created ${movies.length} movies.`);

    // ==================== HALLS ====================
    const hall1 = await Hall.create({ name: 'Sala 1 - Standard', rows: 10, seatsPerRow: 12 });
    const hall2 = await Hall.create({ name: 'Sala 2 - Comfort', rows: 8, seatsPerRow: 10 });
    const hall3 = await Hall.create({ name: 'Sala 3 - IMAX Premium', rows: 12, seatsPerRow: 15 });
    console.log('Seeder: Created 3 halls.');

    // ==================== SEATS ====================
    const seatsData = [];
    for (let row = 1; row <= 10; row++) {
      for (let num = 1; num <= 12; num++) {
        seatsData.push({ hallId: hall1.id, row, number: num, seatType: row >= 9 ? 'vip' : 'standard' });
      }
    }
    for (let row = 1; row <= 8; row++) {
      for (let num = 1; num <= 10; num++) {
        seatsData.push({ hallId: hall2.id, row, number: num, seatType: 'standard' });
      }
    }
    for (let row = 1; row <= 12; row++) {
      for (let num = 1; num <= 15; num++) {
        seatsData.push({ hallId: hall3.id, row, number: num, seatType: row >= 10 ? 'vip' : 'standard' });
      }
    }
    await Seat.bulkCreate(seatsData);
    console.log(`Seeder: Created ${seatsData.length} seats.`);

    // ==================== SCREENINGS ====================
    const screeningsData = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const times = ['10:00', '12:30', '15:00', '17:30', '20:00', '22:30'];
    const halls = [hall1, hall2, hall3];
    const hallPrices = [25.00, 32.00, 45.00];

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = new Date(today);
      date.setDate(date.getDate() + dayOffset);
      for (let movieIdx = 0; movieIdx < movies.length; movieIdx++) {
        const hallIdx = movieIdx % 3;
        const hall = halls[hallIdx];
        const timeSlots = times.slice(0, 2 + (movieIdx % 4));
        for (const time of timeSlots) {
          const [hours, minutes] = time.split(':');
          const startTime = new Date(date);
          startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          screeningsData.push({ movieId: movies[movieIdx].id, hallId: hall.id, startTime, price: hallPrices[hallIdx] });
        }
      }
    }
    await Screening.bulkCreate(screeningsData);
    console.log(`Seeder: Created ${screeningsData.length} screenings.`);

    // ==================== CMS CONTENT ====================
    await SiteContent.bulkCreate([
      { sectionKey: 'hero_title', content: 'Experience Cinema Like Never Before', type: 'text' },
      { sectionKey: 'hero_subtitle', content: 'Book your favorite movies. Choose the perfect seats. Enjoy the show.', type: 'text' },
      { sectionKey: 'footer_text', content: 'CinemaReserve - Your premium cinema booking experience. All rights reserved.', type: 'text' },
      { sectionKey: 'about_text', content: 'CinemaReserve is a modern cinema booking platform offering the best movie experience with comfortable seating, premium sound, and the latest blockbusters.', type: 'text' },
      { sectionKey: 'promo_title', content: 'Special Offer', type: 'text' },
      { sectionKey: 'promo_text', content: 'Get 20% off on all VIP seats every Wednesday!', type: 'text' },
    ]);
    console.log('Seeder: Created CMS content.');

    // ==================== SECTION ORDER ====================
    await SectionOrder.bulkCreate([
      { sectionKey: 'hero', title: 'Hero Banner', position: 1, isVisible: true },
      { sectionKey: 'now_showing', title: 'Now Showing', position: 2, isVisible: true },
      { sectionKey: 'coming_soon', title: 'Coming Soon', position: 3, isVisible: true },
      { sectionKey: 'promo', title: 'Promotions', position: 4, isVisible: true },
    ]);
    console.log('Seeder: Created section order.');

    console.log('\n=== SEED COMPLETE ===');
    console.log('Admin: admin@cinema.pl / Admin123!');
    console.log('User:  jan.wisniewski@email.pl / User123!');
    console.log('=====================\n');

  } catch (error) {
    console.error('Seeder error:', error);
    process.exit(1);
  }
}

module.exports = seed;
if (require.main === module) {
  seed().then(() => process.exit(0));
}
