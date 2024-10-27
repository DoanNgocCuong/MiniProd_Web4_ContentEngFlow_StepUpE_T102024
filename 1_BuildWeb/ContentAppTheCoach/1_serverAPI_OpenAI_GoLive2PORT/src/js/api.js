const API_URL = 'http://localhost:3001/api/openai';

export async function generateQuestions(topic, level) {
    const systemPrompt = `You are an English language teacher. Generate appropriate ${level} level questions about ${topic}.`;
    const userInputPrompt = `Create 5 questions about ${topic} suitable for ${level} level students.`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                systemPrompt,
                userInputPrompt
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}