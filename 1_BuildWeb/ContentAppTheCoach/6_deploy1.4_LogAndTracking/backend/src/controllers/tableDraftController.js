const LarkbaseService = require('../services/larkbaseService');
const { TABLES } = require('../constants/larkbaseTables');

exports.submitDraft = async (req, res) => {
    try {
        const { lesson_id, input, raw, final } = req.body;

        // Validate required fields
        if (!lesson_id) {
            return res.status(400).json({
                error: 'lesson_id is required'
            });
        }

        if (!input || typeof input !== 'string') {
            return res.status(400).json({
                error: 'input is required and must be a string'
            });
        }

        // Prepare data object matching Larkbase fields structure
        const draftData = {
            lesson_id: lesson_id,
            input: input,
            raw: raw || '',      // Optional field
            final: final || ''   // Optional field
        };

        const response = await LarkbaseService.createRecords(
            draftData,
            TABLES.DRAFT
        );

        res.json({
            message: 'Draft submitted successfully',
            data: response.data
        });

    } catch (error) {
        console.error('Error submitting draft:', error);
        res.status(500).json({
            error: 'Failed to submit draft',
            details: error.message
        });
    }
}; 