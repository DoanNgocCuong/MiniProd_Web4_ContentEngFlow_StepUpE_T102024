const LarkbaseService = require('../services/larkbaseService');
const { TABLES } = require('../constants/larkbaseTables');

exports.submitFeedback = async (req, res) => {
    try {
        const { feedback } = req.body;

        if (!feedback || typeof feedback !== 'string') {
            return res.status(400).json({
                error: 'Invalid feedback format. Feedback must be a non-empty string.'
            });
        }

        // Prepare data object matching Larkbase fields structure
        const feedbackData = {
            feedback: feedback
        };

        const response = await LarkbaseService.createRecords(
            feedbackData,
            TABLES.FEEDBACK
        );

        console.log('Feedback submitted successfully:', {
            feedback,
            response: response.data
        });

        res.json({
            message: 'Feedback submitted successfully',
            data: response.data
        });

    } catch (error) {
        console.error('Error submitting feedback:', {
            message: error.message,
            stack: error.stack
        });

        res.status(500).json({
            error: 'Failed to submit feedback',
            details: error.message
        });
    }
};