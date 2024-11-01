const LarkbaseService = require('../services/larkbaseService');
const { TABLES } = require('../constants/larkbaseTables');

exports.submitMeaning = async (req, res) => {
    try {
        const { meaning_id, lesson_id, lesson_input, raw, final } = req.body;

        // Validate required fields
        if (!meaning_id) {
            return res.status(400).json({
                error: 'meaning_id is required'
            });
        }

        if (!lesson_id || typeof lesson_id !== 'string') {
            return res.status(400).json({
                error: 'lesson_id is required and must be a string'
            });
        }

        if (!lesson_input || typeof lesson_input !== 'string') {
            return res.status(400).json({
                error: 'lesson_input is required and must be a string'
            });
        }

        // Prepare data object matching Larkbase fields structure
        const meaningData = {
            meaning_id: meaning_id,
            lesson_id: lesson_id,
            lesson_input: lesson_input,
            raw: typeof raw === 'string' ? raw : JSON.stringify(raw) || '',
            final: typeof final === 'string' ? final : JSON.stringify(final) || ''
        };

        console.log('Meaning Data:', meaningData);

        const response = await LarkbaseService.createRecords(
            meaningData,
            TABLES.MEANING
        );

        res.json({
            message: 'Meaning submitted successfully',
            data: response.data
        });

    } catch (error) {
        console.error('Error submitting meaning:', error);
        res.status(500).json({
            error: 'Failed to submit meaning',
            details: error.message
        });
    }
};
