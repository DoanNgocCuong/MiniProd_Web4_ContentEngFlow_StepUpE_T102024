// javascript:backend/src/controllers/questionController.js

const axios = require('axios');

class QuestionController {
    async generateQuestions(req, res) {
        try {
            const { topic, level } = req.body;
            
            if (!topic || !level) {
                return res.status(400).json({ 
                    error: 'Topic and level are required' 
                });
            }

            const prompt = `Generate ${level} level questions on the topic of ${topic}.`;
            
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4',
                    messages: [{ role: 'user', content: prompt }]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            res.json({ 
                questions: response.data.choices[0].message.content 
            });
        } catch (error) {
            console.error('API Error:', error);
            res.status(500).json({ 
                error: 'Failed to generate questions' 
            });
        }
    }
}

module.exports = new QuestionController();
