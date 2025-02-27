import { config } from '../config.js';

const API_URL = config.production.apiUrl;
let flexibleCounter = 1;

class TableLearningFlexibleTracking {
    static async trackFlexibleGeneration(inputData, rawResponse, finalTable) {
        try {
            // Validate lesson_id
            if (!inputData || !inputData.lesson_id) {
                throw new Error('Invalid input data: lesson_id is required');
            }

            // Generate unique flexible_id with counter
            const flexible_id = `flexible_${Date.now()}_${flexibleCounter++}`;

            // Format tracking data
            const flexibleData = {
                flexible_id: flexible_id,
                lesson_id: inputData.lesson_id,
                lesson_input: JSON.stringify(inputData.lessons),
                raw: JSON.stringify(rawResponse),
                final: JSON.stringify(finalTable)
            };

            console.log('Submitting flexible data:', flexibleData);

            // Submit to tracking endpoint
            const response = await fetch(`${API_URL}/submit-learning-flexible`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(flexibleData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to submit flexible tracking: ${errorData.error || response.statusText}`);
            }

            console.log('Flexible tracking submitted successfully');
            
            return flexible_id;

        } catch (error) {
            console.error('Error in trackFlexibleGeneration:', error);
            throw error;
        }
    }
}

export default TableLearningFlexibleTracking; 