// backend/src/routes/index.js

// Import express để tạo router
const express = require('express');
const router = express.Router();

// Controllers
// Mục đích của các controller này là để generate các câu hỏi, các kiểu học khác nhau
// require là để lấy các hàm từ các file controller tương ứng
const questionsController = require('../controllers/generateQuestionsController'); 
const learningMeaningController = require('../controllers/generateLearningMeaningController');
const learningCardController = require('../controllers/generateLearningCardController');
const learningFlexibleController = require('../controllers/generateLearningFlexibleController');
const learningQNAController = require('../controllers/generateLearningQNAController');
const generateLearningPathController = require('../controllers/generateLearningPathController');

const tableFeedbackController = require('../controllers/tableFeedbackController');
const tableDraftController = require('../controllers/tableDraftController');
const tableLearningMeaningController = require('../controllers/tableLearningMeaningController');
const tableLearningCardController = require('../controllers/tableLearningCardController');
const tableLearningFlexibleController = require('../controllers/tableLearningFlexibleController');
const tableLearningQNAController = require('../controllers/tableLearningQNAController');


// Generate questions and other learning types
// Đây là các API để generate các câu hỏi, các kiểu học khác nhau
// sau khi lấy các hàm từ các file controller tương ứng, ta sẽ đưa các hàm này vào router
router.post('/generate-questions', questionsController.generateQuestions);
router.post('/generate-learning-meaning', learningMeaningController.generateLearningMeaning);
router.post('/generate-learning-card', learningCardController.generateLearningCard);
router.post('/generate-learning-flexible', learningFlexibleController.generateFlexibleCard);
router.post('/generate-learning-qna', learningQNAController.generateLearningQNA);
router.post('/generate-learning-path', generateLearningPathController.generateLearningPath);

// Submit feedback
router.post('/submit-feedback', tableFeedbackController.submitFeedback);
router.post('/submit-draft', tableDraftController.submitDraft);
router.post('/submit-learning-meaning', tableLearningMeaningController.submitMeaning);
router.post('/submit-learning-card', tableLearningCardController.submitCard);
router.post('/submit-learning-flexible', tableLearningFlexibleController.submitFlexible);
router.post('/submit-learning-qna', tableLearningQNAController.submitQNA);

// Export router
module.exports = router;
