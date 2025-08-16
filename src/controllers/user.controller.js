let jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt");
let models = require("../models/user.model");
const movieModel = require("../models/movie.model");

exports.getProfile = (req, res) => {
  res.render("index.ejs");
};

exports.LoginPageOfUser = (req, res) => {
  const reason = req.query.reason;
  let msg = null;

  if (reason === "loginFirst") {
    msg = "⚠️ You should login first to access this feature.";
  }

  res.render("UserLogin.ejs", { msg });
};

exports.RegistartionPage = (req, res) => {
  res.render("UserRegistration.ejs");
};

exports.PostUser = (req, res) => {
  const { username, email, password, role } = req.body;

  models.findUserByEmailAndUsername(email, username)
    .then((existingUser) => {
      if (existingUser) {
        return res.render("UserRegistration", { msg: "User already exists with this role" });
      }

      return bcrypt.hash(password, 10)
        .then((hashedPassword) => {
          return models.registeruserIn(username, email, hashedPassword, role)
            .then(() => {
              const token = jwt.sign(
                { username, email, role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
              );

              req.session.user = {
                username,
                email,
                role,
                token
              };

              console.log("Session after registration:", req.session);
              return res.render("UserRegistration", { msg: "User registered and JWT stored in session" });
            });
        });
    })
    .catch((err) => {
      console.error("Error in PostUser:", err);
      res.send("User not registered");
    });
};

exports.LoginUser = (req, res) => {
  const { email, password } = req.body;

  models.findUserByEmail(email)
    .then((user) => {
      console.log("Logged-in user object:", user);

      if (!user) {
        return res.render("UserLogin.ejs", { msg: "User not found" });
      }

      bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.render("UserLogin.ejs", { msg: "Incorrect password" });
          }

          models.incrementLoginCount(email);

          req.session.user = {
            user_id: user.user_id,
            name: user.username,
            email: user.email,
            role: user.role,
            token: jwt.sign(
              { email: user.email, role: user.role },
              process.env.JWT_SECRET,
              { expiresIn: "1h" }
            )
          };

          console.log("Session after login:", req.session);

          if (user.role === "ADMIN") {
            return res.render("AdminDashboard.ejs", { user: req.session.user });
          } else if (user.role === "USER") {
            movieModel.getAllMovies()
              .then((movies) => {
                res.render("userDashboard.ejs", {
                  user: req.session.user,
                  movies
                });
              })
              .catch((err) => {
                console.error("Error fetching movies:", err);
                res.render("userDashboard.ejs", {
                  user: req.session.user,
                  movies: [],
                  msg: "Could not fetch movies"
                });
              });
          } else {
            return res.render("UserLogin.ejs", { msg: "Invalid role" });
          }
        });
    })
    .catch((err) => {
      console.error("Login error:", err);
      res.render("UserLogin.ejs", { msg: "Login Error" });
    });
};

exports.checkSession = (req, res) => {
  if (req.session.user) {
    res.send(`Session is stored. User: ${JSON.stringify(req.session.user)}`);
  } else {
    res.send("No session found.");
  }
};

exports.UserDashBoard = (req, res) => {
  let user = req.session.user;

  if (!user) {
    return res.render("UserLogin.ejs", { msg: "Please log in first." });
  }

  movieModel.getAllMovies()
    .then((movies) => {
      res.render("userDashboard.ejs", {
        user,
        movies
      });
    })
    .catch((err) => {
      console.error("Error fetching movies:", err);
      res.render("userDashboard.ejs", {
        user,
        movies: [],
        msg: "Could not fetch movies"
      });
    });
};

exports.servicepage = (req, res) => {
  res.render("service.ejs");
};

exports.AboutUs = (req, res) => {
  res.render("aboutus.ejs");
};

exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.send("Could not log out.");
    }
    res.redirect("/");
  });
};

exports.adminDashboard = (req, res) => {
  let userCountQuery = 'SELECT COUNT(*) AS totalUsers FROM users';
  let loginCountQuery = 'SELECT SUM(login_count) AS totalLogins FROM users';

  models.getUserAndLoginCounts(userCountQuery, loginCountQuery)
    .then((result) => {
      const { totalUsers, totalLogins } = result;

      console.log("Total Users:", totalUsers);
      console.log("Total Logins:", totalLogins);

      res.render("AdminDashboard", {
        user: req.session.user,
        totalUsers,
        totalLogins
      });
    })
    .catch((err) => {
      console.error("Error loading dashboard:", err);
      res.status(500).send("Dashboard error");
    });
};

exports.viewUsers = (req, res) => {
  models.viewUseList()
    .then((result) => {
      res.render("userList", {
        users: result
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.searchMoviesAjax = (req, res) => {
  const query = req.query.query;

  if (!query || query.trim() === '') {
    return res.json([]);
  }

  models.searchMoviesByFields(query, (err, movies) => {
    if (err) {
      console.error('Search error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json(movies);
  });
};

exports.RecommendationPage = (req, res) => {
  const user = req.session?.user || null;

  movieModel.getAllMovies()
    .then((movies) => {
      res.render("recommendation", {
        user,
        recommendedMovies: movies
      });
    })
    .catch((err) => {
      console.error("Error loading recommendations:", err);
      res.status(500).send("Failed to load recommendations");
    });
};
//dd