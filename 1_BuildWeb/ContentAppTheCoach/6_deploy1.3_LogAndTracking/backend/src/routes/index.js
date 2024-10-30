const express = require('express');
const router = express.Router();

const questionsController = require('../controllers/generateQuestionsController');
const learningMeaningController = require('../controllers/generateLearningMeaningController');
const learningCardController = require('../controllers/generateLearningCardController');
const learningFlexibleController = require('../controllers/generateLearningFlexibleController');
const learningQNAController = require('../controllers/generateLearningQNAController');

router.post('/generate-questions', questionsController.generateQuestions);
router.post('/generate-learning-meaning', learningMeaningController.generateLearningMeaning);
router.post('/generate-learning-card', learningCardController.generateLearningCard);
router.post('/generate-learning-flexible', learningFlexibleController.generateFlexibleCard);
router.post('/generate-learning-qna', learningQNAController.generateLearningQNA);

module.exports = router;
