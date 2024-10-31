import { config } from '../config.js';

const API_URL = config.production.apiUrl;

class TableDraftTracking {
    static generateLessonId(topic) {
        const now = new Date();
        const time = now.getHours().toString().padStart(2, '0') + 
                    now.getMinutes().toString().padStart(2, '0');
        const date = now.getDate().toString().padStart(2, '0') + 
                    (now.getMonth() + 1).toString().padStart(2, '0') + 
                    now.getFullYear();
        
        const normalizedTopic = topic.toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_');
            
        return `${normalizedTopic}_${time}_${date}`;
    }

    static async trackDraftGeneration(inputData, rawResponse, finalTable = '') {
        try {
            const lesson_id = this.generateLessonId(inputData.topic);
            
            // Clean and prepare data
            const cleanInput = {
                topic: inputData.topic || '',
                level: inputData.level || '',
                questionCount: inputData.questionCount || '',
                extraRequirements: inputData.extraRequirements || ''
            };

            // Ensure data is properly stringified
            const draftData = {
                lesson_id: lesson_id,
                input: JSON.stringify(cleanInput),
                raw: JSON.stringify(rawResponse),
                final: finalTable ? JSON.stringify(finalTable) : ''
            };

            const response = await fetch(`${API_URL}/submit-draft`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(draftData)
            });

            if (!response.ok) {
                throw new Error('Failed to submit draft tracking');
            }

            return lesson_id;
        } catch (error) {
            console.error('Error tracking draft:', error);
            throw error;
        }
    }

    static async updateFinalTable(lesson_id, finalTableData) {
        try {
            // Clean the table data before sending
            const cleanTableData = finalTableData.map(row => ({
                question: row.question || '',
                structure: row.structure || '',
                'main phrase': row['main phrase'] || '',
                'optional phrase 1': row['optional phrase 1'] || '',
                'optional phrase 2': row['optional phrase 2'] || '',
                'question-vi': row['question-vi'] || '',
                'structure-vi': row['structure-vi'] || '',
                'main phrase-vi': row['main phrase-vi'] || '',
                'optional phrase 1-vi': row['optional phrase 1-vi'] || '',
                'optional phrase 2-vi': row['optional phrase 2-vi'] || ''
            }));

            const draftData = {
                lesson_id,
                input: '',  // Không cần cập nhật
                raw: '',    // Không cần cập nhật
                final: JSON.stringify(cleanTableData)
            };

            const response = await fetch(`${API_URL}/submit-draft`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(draftData)
            });

            if (!response.ok) {
                throw new Error('Failed to update final table data');
            }
        } catch (error) {
            console.error('Error updating final table:', error);
            throw error;
        }
    }
}

export default TableDraftTracking;
