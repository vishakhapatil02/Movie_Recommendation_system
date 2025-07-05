let express = require("express");
let bodyparser = require("body-parser");
let cors = require("cors");
let path=require("path");
require("dotenv").config();
const db = require("./config/db");

let app = express();
app.set("view engine",'ejs');
app.set("views", path.join(__dirname, "client"));

app.use(express.static('public'));

const session = require('express-session');

app.use(express.static(path.join(__dirname,"client")));

app.use(session({
  secret: "thisisaverysecuresecretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true in production with HTTPS
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
// app.use(express.static('public'))


//router for admin movie handler
let userRoutes = require("./routes/user.routes");
app.use("/", userRoutes);

let movieRouter=require("./routes/movie.routes");

app.use("/movies",movieRouter);
app.use("/",movieRouter);


let watchlist=require("./routes/watchlist.routes");

app.use("/watchlistpage",watchlist);

let rating=require("../src/routes/rating.routes");
app.use("/",rating);


const recommendationRoutes = require('./routes/recommendationRoutes');
app.use('/', recommendationRoutes); 
module.exports = app;

