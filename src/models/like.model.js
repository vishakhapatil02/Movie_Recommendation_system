const db = require('../config/db'); // or your DB config path

exports.saveLike = (userId, movieId) => {
  const query = 'INSERT INTO liked_movies (user_id, movie_id) VALUES (?, ?)';
  return db.promise().execute(query, [userId, movieId]);
};


exports.getLikedMovies = (userId) => {
  return db.promise().query(`
    SELECT 
      m.movie_id,
      m.title,
      m.poster_url,
      m.trailer_url,
      m.movie_url,
      m.genre
    FROM liked_movies l
    INNER JOIN movies m ON l.movie_id = m.movie_id
    WHERE l.user_id = ?
  `, [userId])
  .then(([rows]) => rows); // Important: return only rows
};

exports.removeLike = (user_id, movie_id) => {
  return db.promise().query(
    "DELETE FROM liked_movies WHERE user_id = ? AND movie_id = ?",
    [user_id, movie_id]
  );
};
<<<<<<< HEAD
//hh
=======
>>>>>>> df97fdef0f175bfccd48977fb1871122b4ed25a2
