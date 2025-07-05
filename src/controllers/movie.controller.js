const movieModel = require("../models/movie.model");

const rating = require("../models/rating.model");
const models = require("../models/user.model"); // Assuming user.model.js exports needed methods

// Show Add Movie Form
exports.addMoviePage = (req, res) => {
  res.render("addmoviePage.ejs");
};

// Save Movie to DB
exports.saveMovie = (req, res) => {
  const {
    title, description, release_date, genre, director,
    language, country, budget, revenue, runtime,
    poster_url, trailer_url, movie_url
  } = req.body;

  if (!title || !release_date || !genre) {
    return res.status(400).render("addmoviePage", {
      msg: "❌ Title, Release Date, and Genre are required."
    });
  }

  movieModel.addMovie(
    title, description, release_date, genre, director,
    language, country, parseFloat(budget), parseFloat(revenue),
    parseInt(runtime), poster_url, trailer_url, movie_url
  )
    .then(() => res.render("addmoviePage", { msg: "✅ Movie added successfully!" }))
    .catch(err => {
      console.error("❌ Error saving movie:", err);
      res.status(500).render("addmoviePage", { msg: "❌ Failed to save movie." });
    });
};

// View All Movies with Ratings
exports.viewSaveMovies = (req, res) => {
  movieModel.getAllMovies()
    .then(movies => {
      const statsPromises = movies.map(movie =>
        rating.getMovieStats(movie.movie_id)
          .then(stats => ({
            id: movie.movie_id,
            avgRating: stats.avgRating,
            totalVotes: stats.totalVotes
          }))
      );

      return Promise.all(statsPromises).then(statsArray => {
        const statsMap = statsArray.reduce((acc, stat) => {
          acc[stat.id] = stat;
          return acc;
        }, {});
        res.render("viewMovieDetails", { movies, statsMap });
      });
    })
    .catch(err => {
      console.error("Error fetching movies:", err);
      res.status(500).send("Error loading movies");
    });
};

// Edit Movie Page
exports.editMoviePage = (req, res) => {
  const movieId = req.params.id;

  movieModel.getMovieById(movieId)
    .then(([rows]) => {
      const movie = rows[0];
      if (!movie) return res.status(404).send("Movie not found");
      if (movie.release_date && !(movie.release_date instanceof Date)) {
        movie.release_date = new Date(movie.release_date);
      }
      res.render('editMovies', { movie });
    })
    .catch(err => {
      console.error("Error fetching movie:", err);
      res.status(500).send("Server Error");
    });
};

// Update Movie
exports.updateMovie = (req, res) => {
  const id = req.params.id;
  movieModel.updateMovie(id, req.body)
    .then(() => res.redirect("/movies/viewMovies"))
    .catch(err => {
      console.error("Error updating movie:", err);
      res.status(500).send("Error updating movie");
    });
};

// Delete Movie
exports.deleteMovie = (req, res) => {
  const id = req.params.id;
  movieModel.deleteMovie(id)
    .then(() => res.redirect("/movies/viewMovies"))
    .catch(err => {
      console.error("Error deleting movie:", err);
      res.status(500).send("Error deleting movie");
    });
};

// User Dashboard with Recommendation
exports.UserDashBoard = async (req, res) => {
  const email = req.session.email || req.user?.email;

  try {
    const user = await models.getUserByEmail(email);
    const userId = user.id;

    const topGenres = await models.getTopGenresByUser(userId);
    const recommendedMovies = await models.getMoviesByGenresExcludingWatched(userId, topGenres);

    res.render("userDashboard", {
      user,
      movies: recommendedMovies
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).send("Error loading recommendations.");
  }
};

// Genre-based Recommendations
exports.getRecommendationByGenre = (req, res) => {
  const genre = req.query.genre;

  if (!genre || genre.trim() === "") {
    return res.status(400).send("Genre is required");
  }

  movieModel.getMoviesByGenre(genre, (err, movies) => {
    if (err) {
      console.error("Recommendation error:", err);
      return res.status(500).send("Internal Server Error");
    }

    res.render("userDashboard", {
      user: req.session.user,
      movies,
      genreSelected: genre
    });
  });
};
