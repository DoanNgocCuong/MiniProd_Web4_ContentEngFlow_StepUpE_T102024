import { config } from '../config.js';

const API_URL = config.development.apiUrl;
let meaningCounter = 1;

class TableLearningMeaningTracking {
    static async trackMeaningGeneration(inputData, rawResponse, finalTable) {
        try {
            // Validate input data
            if (!inputData || !inputData.lesson_id) {
                throw new Error('Invalid input data: lesson_id is required');
            }

            // Generate meaning_id
            const meaning_id = `meaning_${Date.now()}_${meaningCounter++}`;

            // Format data theo đúng yêu cầu của API
            const meaningData = {
                meaning_id: meaning_id,
                lesson_id: inputData.lesson_id,
                lesson_input: JSON.stringify(inputData.lessons),  // đổi từ input thành lesson_input
                raw: JSON.stringify(rawResponse),
                final: JSON.stringify(finalTable)
            };

            console.log('Submitting meaning data:', meaningData);

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
