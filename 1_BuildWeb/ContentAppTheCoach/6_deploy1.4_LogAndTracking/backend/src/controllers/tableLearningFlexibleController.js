const LarkbaseService = require('../services/larkbaseService');
const { TABLES } = require('../constants/larkbaseTables');

exports.submitFlexible = async (req, res) => {
    try {
        const { flexible_id, lesson_id, lesson_input, raw, final } = req.body;

        // Validate required fields
        if (!flexible_id) {
            return res.status(400).json({
                error: 'flexible_id is required'
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
        const flexibleData = {
            flexible_id: flexible_id,
            lesson_id: lesson_id,
            lesson_input: lesson_input,
            raw: typeof raw === 'string' ? raw : JSON.stringify(raw) || '',
            final: typeof final === 'string' ? final : JSON.stringify(final) || ''
        };

        console.log('Flexible Data:', flexibleData);

        const response = await LarkbaseService.createRecords(
            flexibleData,
            TABLES.FLEXIBLE
        );

        res.json({
            message: 'Flexible submitted successfully',
            data: response.data
        });

    } catch (error) {
        console.error('Error submitting flexible:', error);
        res.status(500).json({
            error: 'Failed to submit flexible',
            details: error.message
        });
    }
}; 