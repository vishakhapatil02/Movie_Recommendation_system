const express = require('express');
const router = express.Router();
const controller = require('../controllers/recommendation.controller');

router.get('/recommendations/:userId', controller.showRecommendations); // renders EJS

module.exports = router;
