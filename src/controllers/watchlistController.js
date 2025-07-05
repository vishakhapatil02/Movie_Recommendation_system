let movieModel = require("../models/watchlist.model");

// Show the main dashboard with movies
exports.watchlistPage = (req, res) => {
  const user = req.session.user || { user_id: 1 };

  const added = req.session.added; // 🌟 get message
  req.session.added = null;        // 🌟 clear it after use

  movieModel.getAllMovies()
    .then((movies) => {
      res.render("userDashboard", { movies, user, added });
    }).catch((err) => {
      res.status(500).send("Error fetching movies");
    });
};

// POST: Add to Watchlist
exports.insertToWatchList = (req, res) => {
  const movie_id = req.body.movie_id;
  const user_id = req.session.user?.user_id;

  if (!user_id) {
    return res.status(401).send("Unauthorized");
  }

  movieModel.checkWatchlistExists(user_id, movie_id)
    .then((exists) => {
      if (exists) {
        req.session.added = 'duplicate'; // ⚠️ already added
        res.redirect("/watchlistpage");
      } else {
        return movieModel.addTowatchlist(user_id, movie_id)
          .then(() => {
            req.session.added = 'true'; // ✅ successfully added
            res.redirect("/watchlistpage");
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error adding to watchlist");
    });
};

// GET: Movies from Watchlist
exports.getWatchListMovies = (req, res) => {
  const user = req.session.user;

  if (!user || !user.user_id) {
    return res.redirect("/?form=login");
  }

  movieModel.getwatlistMovies(user.user_id)
    .then((movies) => {
      res.render("watchlistMovies.ejs", { movies, user });
    })
    .catch((err) => {
      console.error("Error loading watchlist:", err);
      res.status(500).send("Error loading watchlist");
    });
};

exports.removeFromWatchlist = (req, res) => {
  const user_id = req.session.user?.user_id;
  const movie_id = req.body.movie_id;

  if (!user_id) {
    return res.status(401).send("Unauthorized");
  }

  movieModel.removeFromWatchlist(user_id, movie_id)
    .then(() => {
      res.redirect('/watchlistpage/watlistmovies');
    })
    .catch((err) => {
      console.error("Error removing movie from watchlist:", err);
      res.status(500).send("Error removing movie from watchlist");
    });
};
