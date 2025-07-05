const db = require("../config/db");

exports.getUserRating = (user_id, movie_id) => {
  return db.promise().query(
    "SELECT rating FROM ratings WHERE user_id = ? AND movie_id = ?",
    [user_id, movie_id]
  );
};

exports.addOrUpdateRating = (user_id, movie_id, rating) => {
  return db.promise().query(
    `INSERT INTO ratings (user_id, movie_id, rating) 
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
    [user_id, movie_id, rating]
  );
};

exports.getMovieStats = (movie_id) => {
  return db.promise().query(
    `SELECT 
       ROUND(AVG(rating), 1) AS avgRating, 
       COUNT(*) AS totalVotes 
     FROM ratings 
     WHERE movie_id = ?`,
    [movie_id]
  ).then(([rows]) => rows[0]); //  return a single stats object
};

// Get all rated movies by user with rating and movie details
exports.getRatedMoviesByUser = (user_id) => {
  const sql = `
    SELECT m.*, r.rating 
    FROM ratings r
    JOIN movies m ON r.movie_id = m.movie_id
    WHERE r.user_id = ?
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [user_id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};
