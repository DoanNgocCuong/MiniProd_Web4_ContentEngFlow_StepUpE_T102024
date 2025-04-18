// author: Doan Ngoc Cuong
// date: 2025-03-27
// backend/src/controllers/ generatechunkingPhrasesController.js

const OpenAI = require('openai');
const { MAX_CONCURRENT_REQUESTS, ENABLE_PARALLEL_LOGGING, formatTimestamp } = require('../config/maxWorkers');
const { processInParallelBatches } = require('../utils/openaiProcessor');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Import the existing controllers
const generateLearningMeaning = require('./generateLearningMeaningController').generateLearningMeaning;
const generateLearningCard = require('./generateLearningCardController').generateLearningCard;
const generateLearningFlexible = require('./generateLearningFlexibleController').generateFlexibleCard;
const generateLearningQNA = require('./generateLearningQNAController').generateLearningQNA;

/**
 * Process a single lesson with all 4 exercise types
 * @param {Object} lesson - The lesson data to process
 * @returns {Promise<Object>} - Promise resolving to combined results
 */
async function processLesson(lesson) {
    try {
        // Create mock request objects for each controller
        const mockReq = { body: { lessons: [lesson] } };
        
        // Create a promise wrapper for each controller
        const getMeaningResults = new Promise((resolve) => {
            const mockRes = {
                json: (data) => resolve(data),
                status: () => mockRes
            };
            generateLearningMeaning(mockReq, mockRes).catch(error => {
                console.error('Error in generateLearningMeaning:', error);
                resolve([]); // Return empty array if error
            });
        });

        const getCardResults = new Promise((resolve) => {
            const mockRes = {
                json: (data) => resolve(data),
                status: () => mockRes
            };
            generateLearningCard(mockReq, mockRes).catch(error => {
                console.error('Error in generateLearningCard:', error);
                resolve([]); // Return empty array if error
            });
        });

        const getFlexibleResults = new Promise((resolve) => {
            const mockRes = {
                json: (data) => resolve(data),
                status: () => mockRes
            };
            generateLearningFlexible(mockReq, mockRes).catch(error => {
                console.error('Error in generateLearningFlexible:', error);
                resolve([]); // Return empty array if error
            });
        });

        const getQNAResults = new Promise((resolve) => {
            const mockRes = {
                json: (data) => resolve(data),
                status: () => mockRes
            };
            generateLearningQNA(mockReq, mockRes).catch(error => {
                console.error('Error in generateLearningQNA:', error);
                resolve([]); // Return empty array if error
            });
        });

        // Call all 4 APIs in parallel and wait for all to complete
        const [meaningResults, cardResults, flexibleResults, qnaResults] = await Promise.all([
            getMeaningResults,
            getCardResults,
            getFlexibleResults,
            getQNAResults
        ]);

        // Log timing information
        console.log(`${formatTimestamp()} Processed lesson ${lesson.lesson_id || 'unknown'}:`, {
            meaningCount: meaningResults.length,
            cardCount: cardResults.length,
            flexibleCount: flexibleResults.length,
            qnaCount: qnaResults.length
        });

        return {
            meaning: meaningResults,
            card: cardResults,
            flexible: flexibleResults,
            qna: qnaResults
        };
    } catch (error) {
        console.error('Error processing lesson:', error);
        throw error;
    }
}

exports.generateAllExercises = async (req, res) => {
    try {
        const { lessons } = req.body;

        console.log(`${formatTimestamp()} Starting to process ${lessons.length} lessons`);

        // Process all lessons in parallel with batching
        const allResults = await processInParallelBatches(
            lessons,
            processLesson,
            { 
                batchSize: MAX_CONCURRENT_REQUESTS,
                itemType: 'combined',
                shouldFlatten: false
            }
        );

        console.log(`${formatTimestamp()} Successfully processed ${allResults.length} lessons`);

        res.json(allResults);

    } catch (error) {
        console.error('Error in generateAllExercises:', error);
        res.status(500).json({ 
            error: error.message,
            details: error.stack
        });
    }
};