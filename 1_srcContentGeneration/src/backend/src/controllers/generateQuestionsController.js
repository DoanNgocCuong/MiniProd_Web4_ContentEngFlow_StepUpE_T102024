// backend/src/controllers/ generateQuestionsController.js

const OpenAI = require('openai');
const { BATCH_SIZE, MAX_TOKENS } = require('../config/batchConfig');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

exports.generateQuestions = async (req, res) => {
    try {
        const { prompt } = req.body;
        // Lấy số lượng câu hỏi từ prompt
        const questionCount = parseInt(prompt.match(/Generate (\d+) English/)[1]);
        const batches = Math.ceil(questionCount / BATCH_SIZE);
        let allQuestions = [];

        for (let i = 0; i < batches; i++) {
            const batchSize = Math.min(BATCH_SIZE, questionCount - i * BATCH_SIZE);
            const batchPrompt = prompt.replace(/Generate \d+ English/, `Generate ${batchSize} English`);
            
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { 
                        role: 'system', 
                        content: 'You are an expert at generating content related to English lesson topics. Return an array of question objects in JSON format, without including any other characters such as ```JSON. '
                    },
                    { role: 'user', content: batchPrompt + '\n Important rules for Vietnamese sentence structure: - Always place ___ at the natural position in Vietnamese sentences. - For adjective phrases: Subject + ___ (correct: "trò chơi này ___", NOT: "___ trò chơi này"). - For verb phrases: Subject + ___ + Object (correct: "tôi ___ bài tập", NOT: "___ tôi bài tập").'}
                ],
                max_tokens: MAX_TOKENS,
                temperature: 0
            });

            const content = response.choices[0].message.content;
            const parsedContent = JSON.parse(content.trim().replace(/```json|```/g, ''));
            allQuestions = allQuestions.concat(parsedContent);
        }

        res.json({ questions: allQuestions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};