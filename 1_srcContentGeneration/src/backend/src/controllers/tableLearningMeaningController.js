const LarkbaseService = require('../services/larkbaseService');
const { TABLES } = require('../constants/larkbaseTables');
const { BATCH_SIZE } = require('../config/batchConfig');

/**
 * Controller xử lý việc lưu trữ thông tin ý nghĩa (meaning) của bài học vào Larkbase
 * @param {Object} req - Request object từ client
 * @param {Object} res - Response object để trả về client
 */
exports.submitMeaning = async (req, res) => {
    try {
        // Lấy dữ liệu từ request body
        const { meaning_id, lesson_id, lesson_input, raw, final } = req.body;

        // Kiểm tra các trường bắt buộc
        // Trường meaning_id là bắt buộc
        if (!meaning_id) {
            return res.status(400).json({
                error: 'meaning_id is required'
            });
        }

        // Trường lesson_id là bắt buộc và phải là string
        if (!lesson_id || typeof lesson_id !== 'string') {
            return res.status(400).json({
                error: 'lesson_id is required and must be a string'
            });
        }

        // Trường lesson_input là bắt buộc và phải là string
        if (!lesson_input || typeof lesson_input !== 'string') {
            return res.status(400).json({
                error: 'lesson_input is required and must be a string'
            });
        }

        // Chuẩn bị dữ liệu để lưu vào Larkbase
        // Chuyển đổi raw và final thành string nếu chúng không phải là string
        const meaningData = {
            meaning_id: meaning_id,
            lesson_id: lesson_id,
            lesson_input: lesson_input,
            raw: typeof raw === 'string' ? raw : JSON.stringify(raw) || '',
            final: typeof final === 'string' ? final : JSON.stringify(final) || ''
        };

        console.log('Meaning Data:', meaningData);

        // Gọi service để tạo bản ghi trong bảng MEANING
        const response = await LarkbaseService.createRecords(
            meaningData,
            TABLES.MEANING
        );

        // Trả về kết quả thành công
        res.json({
            message: 'Meaning submitted successfully',
            data: response.data
        });

    } catch (error) {
        // Xử lý lỗi và trả về thông báo lỗi
        console.error('Error submitting meaning:', error);
        res.status(500).json({
            error: 'Failed to submit meaning',
            details: error.message
        });
    }
};

/**
 * Hàm xử lý dữ liệu theo lô (batch processing)
 * Được chuẩn bị để xử lý nhiều bản ghi cùng lúc nếu cần
 * @param {Array} records - Mảng các bản ghi cần xử lý
 */
async function processBatch(records) {
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
        const batch = records.slice(i, i + BATCH_SIZE);
        // Xử lý từng lô dữ liệu
        // TODO: Implement xử lý batch khi cần
    }
}

/**
 * Controller để lấy thông tin learning meaning
 * Hiện tại đang được để trống, có thể sẽ được implement sau
 * Có ghi chú về việc xử lý các thẻ <g> và <r>
 */
exports.getLearningMeaning = (req, res) => {
    // TODO: Implement lấy dữ liệu learning meaning
}
