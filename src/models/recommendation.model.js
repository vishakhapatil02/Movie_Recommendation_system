const db = require('../config/db');

// Step 1: Get genres of movies user rated >= 4
exports.getUserPreferredGenres = (userId, callback) => {
  const genreSet = new Set();

  db.query(`
    SELECT genre FROM ratings
    JOIN movies ON ratings.movie_id = movies.movie_id
    WHERE ratings.user_id = ? AND rating >= 4
  `, [userId], (err, rows) => {
    if (err) return callback(err);

    rows.forEach(row => {
      row.genre.split(',').forEach(g => genreSet.add(g.trim()));
    });

    callback(null, Array.from(genreSet));
  });
};

// Step 2: Get unrated movies with matching genres
exports.getMatchingMovies = (userId, genres, callback) => {
  if (genres.length === 0) return callback(null, []);

  const genreCondition = genres.map(g => `genre LIKE '%${g}%'`).join(' OR ');
  //To build a dynamic SQL WHERE condition that matches multiple genres using LIKE.
  
  const sql = `
    SELECT * FROM movies
    WHERE movie_id NOT IN (
      SELECT movie_id FROM ratings WHERE user_id = ?
    ) AND (${genreCondition})
    LIMIT 5
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
};

// Step 3: Save recommendations
exports.saveRecommendations = (userId, movies, callback) => {
  let pending = movies.length;
  if (pending === 0) return callback(null);

  movies.forEach(movie => {
    db.query(`
      INSERT IGNORE INTO recommendations (user_id, movie_id) VALUES (?, ?)
    `, [userId, movie.movie_id], (err) => {
      if (err) return callback(err);
      pending--;
      if (pending === 0) callback(null);
    });
  });
};

// Step 4: Main function to call all in sequence
exports.generateAndSaveRecommendations = (userId, finalCallback) => {
  this.getUserPreferredGenres(userId, (err, genres) => {
    if (err) return finalCallback(err);

    this.getMatchingMovies(userId, genres, (err, movies) => {
      if (err) return finalCallback(err);

      this.saveRecommendations(userId, movies, (err) => {
        if (err) return finalCallback(err);
        finalCallback(null, movies);
      });
    });
  });
};
