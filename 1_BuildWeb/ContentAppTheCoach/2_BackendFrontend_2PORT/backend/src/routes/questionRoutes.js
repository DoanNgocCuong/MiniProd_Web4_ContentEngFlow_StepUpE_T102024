//javascript:backend/src/routes/questionRoutes.js

const express = require('express');
const questionController = require('../controllers/questionController');

const router = express.Router();

router.post('/generate', questionController.generateQuestions);

module.exports = router;

