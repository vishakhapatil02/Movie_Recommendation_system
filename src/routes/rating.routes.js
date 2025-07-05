// src/routes/rating.routes.js
const router = require("express").Router();
const ratingController = require("../controllers/ratingController");
router.get('/rating/:movie_id', ratingController.getRatingPage);

router.post("/rate", ratingController.submitRating);

router.get("/ratedmovies", ratingController.viewRatedMovies);


module.exports = router;
