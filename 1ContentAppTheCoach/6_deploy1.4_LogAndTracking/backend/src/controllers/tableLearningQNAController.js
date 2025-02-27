const LarkbaseService = require('../services/larkbaseService');
const { TABLES } = require('../constants/larkbaseTables');

exports.submitQNA = async (req, res) => {
    try {
        const { qna_id, lesson_id, lesson_input, raw, final } = req.body;

        // Validate required fields
        if (!qna_id) {
            return res.status(400).json({
                error: 'qna_id is required'
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
        const qnaData = {
            qna_id: qna_id,
            lesson_id: lesson_id,
            lesson_input: lesson_input,
            raw: typeof raw === 'string' ? raw : JSON.stringify(raw) || '',
            final: typeof final === 'string' ? final : JSON.stringify(final) || ''
        };

        console.log('QNA Data:', qnaData);

        const response = await LarkbaseService.createRecords(
            qnaData,
            TABLES.QNA
        );

        res.json({
            message: 'QNA submitted successfully',
            data: response.data
        });

    } catch (error) {
        console.error('Error submitting QNA:', error);
        res.status(500).json({
            error: 'Failed to submit QNA',
            details: error.message
        });
    }
};

