const LarkbaseService = require('../services/larkbaseService');
const { TABLES } = require('../constants/larkbaseTables');

exports.submitCard = async (req, res) => {
    try {
        const { card_id, lesson_id, lesson_input, raw, final } = req.body;

        // Validate required fields
        if (!card_id) {
            return res.status(400).json({
                error: 'card_id is required'
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
        const cardData = {
            card_id: card_id,
            lesson_id: lesson_id,
            lesson_input: lesson_input,
            raw: typeof raw === 'string' ? raw : JSON.stringify(raw) || '',
            final: typeof final === 'string' ? final : JSON.stringify(final) || ''
        };

        console.log('Card Data:', cardData);

        const response = await LarkbaseService.createRecords(
            cardData,
            TABLES.CARD
        );

        res.json({
            message: 'Card submitted successfully',
            data: response.data
        });

    } catch (error) {
        console.error('Error submitting card:', error);
        res.status(500).json({
            error: 'Failed to submit card',
            details: error.message
        });
    }
}; 