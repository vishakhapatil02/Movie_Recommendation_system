const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const adminController=require("../controllers/AdminController");
const likeController=require("../controllers/likedController");

router.get("/", userController.getProfile);
router.get("/loginpage",userController.LoginPageOfUser);



router.get("/registration",userController.RegistartionPage);
router.post("/saveUser",userController.PostUser);

router.post("/login", userController.LoginUser);


router.get("/check-session", userController.checkSession);

router.get("/services",userController.servicepage);

router.get("/dashboard",userController.UserDashBoard);
router.get("/aboutus",userController.AboutUs);

router.post("/logout", userController.logoutUser);

router.get('/adminDashboard', userController.adminDashboard);

router.get("/userlist",userController.viewUsers);

router.get("/userDashboard", userController.UserDashBoard);

// Search Movies
router.get('/ajax/search', userController.searchMoviesAjax);


router.post('/like', likeController.likeMovie);
router.get('/liked', likeController.viewLikedMovies);
router.post("/liked/remove", likeController.removeLikedMovie);

router.get("/recommendation", userController.RecommendationPage);


router.get("/loginpage", userController.LoginPageOfUser);


module.exports = router;
