let likeModel=require("../models/like.model");
exports.likeMovie = (req, res) => {
  const { movie_id } = req.body;
  const user_id = req.session.user?.user_id;

  if (!user_id) {
     res.render("UserLogin");
  }

  likeModel.saveLike(user_id, movie_id)
    .then(() => {
      res.redirect('/userDashboard?liked=true');
    })
    .catch((err) => {
      console.error("Error liking movie:", err);
      res.redirect('/userDashboard?liked=fail');
    });
};

exports.viewLikedMovies = (req, res) => {
  const user_id = req.session.user?.user_id;

  if (!user_id) {
    return res.render("UserLogin");
  }

  likeModel.getLikedMovies(user_id)
    .then((likedMovies) => {
      if (likedMovies.length === 0) {
        console.log(" No liked movies found.");
      } else {
        likedMovies.forEach((movie, index) => {
          console.log(` Movie #${index + 1}: ${movie.title}`);
          console.log(` Poster URL  : ${movie.poster_url || 'N/A'}`);
          console.log(`Movie URL   : ${movie.movie_url || 'N/A'}`);
          console.log(`   Trailer URL : ${movie.trailer_url || 'N/A'}`);
        });
      }

      // consistent naming: "movies"
      res.render("likedMovies.ejs", {
        user: req.session.user,
        movies: likedMovies
      });
    })
    .catch((err) => {
      console.error(" Error fetching liked movies:", err);

      //  use the same key: "movies"
      res.render("likedMovies.ejs", {
        user: req.session.user,
        movies: []
      });
    });
};

exports.removeLikedMovie = (req, res) => {
  const user_id = req.session.user?.user_id;
  const { movie_id } = req.body;

  if (!user_id) return res.redirect("/login");

  likeModel.removeLike(user_id, movie_id)
    .then(() => {
      res.redirect("/liked"); // Reload liked movies
    })
    .catch((err) => {
      console.error("❌ Error removing liked movie:", err);
      res.redirect("/liked");
    });
};