const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const LEARNING_CARD_PROMPT = `...`; // Your existing prompt

exports.generateLearningCard = async (req, res) => {
    try {
        const { lessons } = req.body;
        const allResults = [];
        
        for (const lesson of lessons) {
            const lessonPrompt = JSON.stringify({
                structure_en: lesson.structure,
                main_phrase: lesson["main phrase"],
                optional_phrase_1: lesson["optional phrase 1"],
                optional_phrase_2: lesson["optional phrase 2"]
            }, null, 2);
            
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { 
                        role: 'system', 
                        content: 'You are an expert at generating English learning cards. Return an array of learning card objects in valid JSON format.' 
                    },
                    { role: 'user', content: lessonPrompt }
                ],
                max_tokens: 3000,
                temperature: 0
            });
            
            try {
                const content = response.choices[0].message.content;
                // Clean JSON string
                const cleanedContent = content.trim().replace(/```json|```/g, '');
                const lessonResults = JSON.parse(cleanedContent);
                
                if (Array.isArray(lessonResults)) {
                    // Validate mỗi kết quả
                    const validResults = lessonResults.filter(result => {
                        const isValid = result.card_front && 
                                      result.card_back && 
                                      result.example_en &&
                                      result.example_vi;
                        
                        if (!isValid) {
                            console.error('Invalid card structure:', result);
                        }
                        return isValid;
                    });

                    if (validResults.length > 0) {
                        allResults.push(...validResults);
                    } else {
                        console.error('No valid results found in response');
                        throw new Error('Invalid learning card format from OpenAI');
                    }
                } else {
                    console.error('Invalid response format:', lessonResults);
                    throw new Error('Response must be an array of learning card objects');
                }
            } catch (parseError) {
                console.error('Parse error:', parseError);
                console.error('Raw content:', response.choices[0].message.content);
                throw new Error('Failed to parse OpenAI response');
            }
        }
        
        res.json(allResults);
    } catch (error) {
        console.error('Error in generateLearningCard:', error);
        res.status(500).json({ 
            error: error.message,
            details: error.stack
        });
    }
};
