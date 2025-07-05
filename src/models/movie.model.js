const db = require("../config/db");

exports.addMovie = (
  title, description, release_date, genre, director,
  language, country, budget, revenue, runtime,
  poster_url, trailer_url, movie_url
) => {
  const sql = `INSERT INTO movies 
    (title, description, release_date, genre, director, language, country, budget, revenue, runtime, poster_url, trailer_url, movie_url) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  return new Promise((resolve, reject) => {
    db.query(sql, [
      title, description, release_date, genre, director,
      language, country, budget, revenue, runtime,
      poster_url, trailer_url, movie_url
    ], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

exports.getAllMovies = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM movies";
    db.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};


exports.getMovieById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM movies WHERE movie_id = ?", [id], (err, rows) => {
      if (err) reject(err);
      else resolve([rows]);
    });
  });
};

exports.updateMovie = (id, data) => {
  const {
    title, description, release_date, genre, director,
    language, country, budget, revenue, runtime,
    poster_url, trailer_url, movie_url
  } = data;

  const sql = `
    UPDATE movies SET 
      title = ?, description = ?, release_date = ?, genre = ?, director = ?, 
      language = ?, country = ?, budget = ?, revenue = ?, runtime = ?, 
      poster_url = ?, trailer_url = ?, movie_url = ?
    WHERE movie_id = ?`;

  return new Promise((resolve, reject) => {
    db.query(sql, [
      title, description, release_date, genre, director,
      language, country, parseFloat(budget), parseFloat(revenue), parseInt(runtime),
      poster_url, trailer_url, movie_url, parseInt(id)
    ], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

exports.deleteMovie = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM movies WHERE movie_id = ?", [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

exports.getMoviesByGenre = (genre, callback) => {
  const sql = "SELECT * FROM movies WHERE LOWER(genre) LIKE LOWER(?) ORDER BY RAND() LIMIT 20";
  db.query(sql, [`%${genre}%`], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};
