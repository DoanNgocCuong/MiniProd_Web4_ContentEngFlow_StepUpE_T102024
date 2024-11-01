import { config } from '../config.js';
import TableDraftTracking from './tableDraftTracking.js';

const API_URL = config.development.apiUrl;
let meaningCounter = 1;

class TableLearningMeaningTracking {
    static async trackMeaningGeneration(inputData, rawResponse, finalTable) {
        try {
            console.log('Received data:', { inputData, rawResponse, finalTable });

            // Validate input data
            if (!inputData || !inputData.lesson_id) {
                throw new Error('Invalid input data: lesson_id is required');
            }

            if (!rawResponse) {
                throw new Error('Raw response data is required');
            }

            if (!finalTable || !Array.isArray(finalTable)) {
                throw new Error('Final table data must be an array');
            }

            const meaning_id = `${inputData.lesson_id}_meaning_${meaningCounter++}`;
            
            // Prepare data for Larkbase
            const meaningData = {
                meaning_id: meaning_id,
                lesson_id: inputData.lesson_id,
                lesson_input: JSON.stringify(inputData.lessons || {}),
                raw: JSON.stringify(rawResponse || []),
                final: JSON.stringify(finalTable || [])
            };

            console.log('Sending data to API:', meaningData);

            const response = await fetch(`${API_URL}/submit-meaning`, {
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

            return meaning_id;
        } catch (error) {
            console.error('Error in trackMeaningGeneration:', error);
            throw error;
        }
    }

    static async updateFinalMeaningTable(meaning_id, finalTableData) {
        try {
            // Clean the table data before sending
            const cleanTableData = finalTableData.map(row => ({
                sentence: row.sentence || '',
                answer_1: row.answer_1 || '',
                answer_2: row.answer_2 || '',
                answer_3: row.answer_3 || '',
                answer_2_description: row.answer_2_description || '',
                answer_3_description: row.answer_3_description || ''
            }));

            const meaningData = {
                meaning_id,
                lesson_id: '',  // Không cần cập nhật
                lesson_input: '', // Không cần cập nhật
                raw: '',    // Không cần cập nhật
                final: JSON.stringify(cleanTableData)
            };

            const response = await fetch(`${API_URL}/submit-meaning`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(meaningData)
            });

            if (!response.ok) {
                throw new Error('Failed to update final meaning table data');
            }
        } catch (error) {
            console.error('Error updating final meaning table:', error);
            throw error;
        }
    }
}

export default TableLearningMeaningTracking;
