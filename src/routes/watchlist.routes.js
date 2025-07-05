const express = require("express");
const router = express.Router();
let watchlist=require("../controllers/watchlistController");

router.get("/", watchlist.watchlistPage);


// router.post('/addWatchlist/:movieId', watchlist.insertToWatchList);
router.post('/addWatchlist', watchlist.insertToWatchList);

router.get("/watlistmovies",watchlist.getWatchListMovies);


// router.get("/page",watchlist.insertToWatchList);

router.post('/watchlist/remove', watchlist.removeFromWatchlist);


module.exports=router;
