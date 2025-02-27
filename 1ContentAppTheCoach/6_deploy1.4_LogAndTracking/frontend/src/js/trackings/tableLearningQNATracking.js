import { config } from '../config.js';

const API_URL = config.production.apiUrl;
let qnaCounter = 1;  // Initialize counter

class TableLearningQNATracking {
    static async trackQNAGeneration(inputData, rawResponse, finalTable) {
        try {
            // Validate lesson_id
            if (!inputData || !inputData.lesson_id) {
                throw new Error('Invalid input data: lesson_id is required');
            }

            // Generate unique qna_id with counter
            const qna_id = `qna_${Date.now()}_${qnaCounter++}`;

            // Format tracking data
            const qnaData = {
                qna_id: qna_id,
                lesson_id: inputData.lesson_id,
                lesson_input: JSON.stringify(inputData.lessons),
                raw: JSON.stringify(rawResponse),
                final: JSON.stringify(finalTable)
            };

            console.log('Submitting QNA data:', qnaData);

            // Submit to tracking endpoint
            const response = await fetch(`${API_URL}/submit-learning-qna`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(qnaData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to submit QNA tracking: ${errorData.error || response.statusText}`);
            }

            console.log('QNA tracking submitted successfully');
            
            return qna_id;

        } catch (error) {
            console.error('Error in trackQNAGeneration:', error);
            throw error;
        }
    }
}

export default TableLearningQNATracking; 