import { config } from '../config.js';

const API_URL = config.production.apiUrl;
let meaningCounter = 1;

class TableLearningMeaningTracking {
    static async trackMeaningGeneration(inputData, rawResponse, finalTable) {
        try {
            // 1. Validate lesson_id tồn tại
            if (!inputData || !inputData.lesson_id) {
                throw new Error('Invalid input data: lesson_id is required');
            }

            // 2. Tạo meaning_id mới cho mỗi lần tracking
            const meaning_id = `meaning_${Date.now()}_${meaningCounter++}`;

            // 3. Format data với lesson_id từ input
            const meaningData = {
                meaning_id: meaning_id,                          // ID unique cho mỗi lần generate meaning
                lesson_id: inputData.lesson_id,                  // Foreign key liên kết với bài học gốc
                lesson_input: JSON.stringify(inputData.lessons), // Data gốc từ generateQuestion
                raw: JSON.stringify(rawResponse),                // Response từ API meaning
                final: JSON.stringify(finalTable)                // Data sau khi edit/delete
            };

            console.log('Submitting meaning data:', meaningData);

            // 4. Submit lên server
            const response = await fetch(`${API_URL}/submit-learning-meaning`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(meaningData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to submit meaning tracking: ${errorData.error || response.statusText}`);
            }

            console.log('Meaning tracking submitted successfully');
            
            return meaning_id;

        } catch (error) {
            console.error('Error in trackMeaningGeneration:', error);
            throw error;
        }
    }
}

export default TableLearningMeaningTracking;
