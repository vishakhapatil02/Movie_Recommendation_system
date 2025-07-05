const model = require('../models/recommendation.model');

// Render EJS View
exports.showRecommendations = (req, res) => {
  const userId = req.params.userId;

  model.generateAndSaveRecommendations(userId, (err, movies) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).send("Internal Server Error");
    }

    res.render('RecommendationsContentBased', { movies, userId });
  });
};
