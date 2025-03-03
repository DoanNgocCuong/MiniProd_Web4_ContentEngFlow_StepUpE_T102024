// backend/src/controllers/ generateQuestionsController.js

const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

exports.generateQuestions = async (req, res) => {
    try {
        const { prompt } = req.body;
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { 
                    role: 'system', 
                    content: 'You are an expert at generating content related to English lesson topics. Return an array of question objects in JSON format, without including any other characters such as ```JSON. '
                },
                { role: 'user', content: prompt + '\n Important rules for Vietnamese sentence structure: - Always place ___ at the natural position in Vietnamese sentences. - For adjective phrases: Subject + ___ (correct: "trò chơi này ___", NOT: "___ trò chơi này"). - For verb phrases: Subject + ___ + Object (correct: "tôi ___ bài tập", NOT: "___ tôi bài tập").'}
            ],
            max_tokens: 3000,
            temperature: 0
        });
        
        // Xử lý response trước khi gửi về client
        const content = response.choices[0].message.content;
        const cleanedContent = content.trim().replace(/```json|```/g, '');
        
        try {
            const parsedContent = JSON.parse(cleanedContent);
            res.json(parsedContent);
        } catch (parseError) {
            res.status(500).json({ 
                error: 'Failed to parse OpenAI response',
                details: parseError.message 
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
