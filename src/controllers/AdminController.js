let models=require("../models/user.model");

exports.logoutAdmin = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.redirect("/adminDashboard");
    }
    res.clearCookie("connect.sid");
    res.redirect("/"); // or wherever your admin login page is
  });
};

<<<<<<< HEAD
//dddd
=======
//dddd
>>>>>>> 0a5e8f9e2d7761c65628976b4c29cc336443434b
