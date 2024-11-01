import { config } from '../config.js';

const API_URL = config.development.apiUrl;
let flexibleCounter = 1;

class TableLearningFlexibleTracking {
    static async trackFlexibleGeneration(inputData, rawResponse, finalTable) {
        try {
            // Validate lesson_id
            if (!inputData || !inputData.lesson_id) {
                throw new Error('Invalid input data: lesson_id is required');
            }

            // Generate unique flexible_id
            const flexible_id = `flexible_${Date.now()}_${flexibleCounter++}`;

            // Format tracking data
            const flexibleData = {
                flexible_id: flexible_id,                        // Unique ID for each flexible generation
                lesson_id: inputData.lesson_id,                  // Foreign key to original lesson
                lesson_input: JSON.stringify(inputData.lessons), // Original data from generateQuestion
                raw: JSON.stringify(rawResponse),                // Raw API response
                final: JSON.stringify(finalTable)                // Data after edits/deletions
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