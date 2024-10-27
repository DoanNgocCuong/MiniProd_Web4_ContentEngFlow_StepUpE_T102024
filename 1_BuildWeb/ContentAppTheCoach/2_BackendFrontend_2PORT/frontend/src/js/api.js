//javascript:frontend/src/js/api.js

const API_URL = 'http://localhost:3000/api/questions';

export async function generateQuestions(topic, level) {
    try {
        const response = await fetch(`${API_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ topic, level })
        });

        if (!response.ok) {
            throw new Error('Failed to generate questions');
        }

        const data = await response.json();
        return data.questions;
    } catch (error) {
        throw new Error(`Error: ${error.message}`);
    }
}

