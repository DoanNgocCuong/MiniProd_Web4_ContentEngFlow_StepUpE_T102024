import { config } from '../config.js';

const API_URL = config.production.apiUrl;
let meaningCounter = 1;

class TableLearningMeaningTracking {
    static async trackMeaningGeneration(inputData, rawResponse, finalTable) {
        try {
            console.log(`Tracking ${finalTable.length} learning meaning results`);
            
            // Tạo meaning_id duy nhất cho tất cả các kết quả của bài học này
            const meaning_id = `MEANING_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            
            // Gọi API để lưu dữ liệu
            const response = await fetch(`${API_URL}/submit-meaning`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    meaning_id: meaning_id,
                    lesson_id: inputData.lesson_id,
                    lesson_input: JSON.stringify(inputData.lessons),
                    raw: rawResponse,
                    final: finalTable
                })
            });

            const data = await response.json();
            console.log('Tracking response:', data);
            return data;
        } catch (error) {
            console.error('Error tracking meaning generation:', error);
            return null;
        }
    }
}

export default TableLearningMeaningTracking;
