import { config } from '../config.js';

const API_URL = config.development.apiUrl;
let cardCounter = 1;

class TableLearningCardTracking {
    static async trackCardGeneration(inputData, rawResponse, finalTable) {
        try {
            // Validate lesson_id
            if (!inputData || !inputData.lesson_id) {
                throw new Error('Invalid input data: lesson_id is required');
            }

            // Generate unique card_id
            const card_id = `card_${Date.now()}_${cardCounter++}`;

            // Format tracking data
            const cardData = {
                card_id: card_id,                               // Unique ID for each card generation
                lesson_id: inputData.lesson_id,                 // Foreign key to original lesson
                lesson_input: JSON.stringify(inputData.lessons), // Original data from generateQuestion
                raw: JSON.stringify(rawResponse),               // Raw API response
                final: JSON.stringify(finalTable)               // Data after edits/deletions
            };

            console.log('Submitting card data:', cardData);

            // Submit to tracking endpoint
            const response = await fetch(`${API_URL}/submit-learning-card`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cardData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to submit card tracking: ${errorData.error || response.statusText}`);
            }

            console.log('Card tracking submitted successfully');
            
            return card_id;

        } catch (error) {
            console.error('Error in trackCardGeneration:', error);
            throw error;
        }
    }
}

export default TableLearningCardTracking;
