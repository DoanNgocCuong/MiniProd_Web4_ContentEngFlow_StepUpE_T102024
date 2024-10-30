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
                    content: 'You are an expert at English lesson topic-related content generating. Return an array of question objects in JSON format, not include other character such as ```JSON.' 
                },
                { role: 'user', content: prompt}
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
