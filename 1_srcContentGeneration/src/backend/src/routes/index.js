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
const generateLearningOnionController = require('../controllers/generateLearningOnionController');
const generate20ChunkingFrom5ScenarioController = require('../controllers/generate20ChunkingFrom5ScenarioController');
const generateAudioController = require('../controllers/generateAudioController');
const generateLearningPTYController = require('../controllers/generateLearningPTYController');
const generateLearningLyLyController = require('../controllers/generateLearningLyLyController');
const generateQuestions4InputController = require('../controllers/generateQuestions4InputController');

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
router.post('/generate-learning-onion', generateLearningOnionController.generateLearningOnion);
router.post('/generate-20-chunking-from-5-scenario', generate20ChunkingFrom5ScenarioController.generate20ChunkingFrom5Scenario);
router.post('/generate-audio', generateAudioController.generateAudio);
router.post('/generate-learning-pty', generateLearningPTYController.generateLearningPTY);
router.post('/generate-learning-lyly', generateLearningLyLyController.generateLearningLyLy);
router.post('/generate-questions-4-inputs', generateQuestions4InputController.generateQuestions);

// Submit feedback
router.post('/submit-feedback', tableFeedbackController.submitFeedback);
router.post('/submit-draft', tableDraftController.submitDraft);
router.post('/submit-learning-meaning', tableLearningMeaningController.submitMeaning);
router.post('/submit-learning-card', tableLearningCardController.submitCard);
router.post('/submit-learning-flexible', tableLearningFlexibleController.submitFlexible);
router.post('/submit-learning-qna', tableLearningQNAController.submitQNA);

// Export router
module.exports = router;
