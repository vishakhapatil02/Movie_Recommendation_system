const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const adminController = require("../controllers/AdminController");
const movieController = require("../controllers/movie.controller");
const ratingController = require("../controllers/ratingController");

// Movie CRUD Routes
router.get("/add", movieController.addMoviePage);
router.post("/save", movieController.saveMovie);
router.get("/viewMovies", movieController.viewSaveMovies);
router.get("/editmovie/:id", movieController.editMoviePage);
router.post("/updatemovie/:id", movieController.updateMovie);
router.get("/deletemovie/:id", movieController.deleteMovie);

// Admin Logout
router.get("/logoutAdmin", adminController.logoutAdmin);

// Rating Routes
router.get("/rate/:movie_id", ratingController.getRatingPage);
router.post("/rate", ratingController.submitRating);

// User Dashboard & Recommendation
router.get("/dashboard", movieController.UserDashBoard);
router.get("/getrecommendation", movieController.getRecommendationByGenre);

module.exports = router;
