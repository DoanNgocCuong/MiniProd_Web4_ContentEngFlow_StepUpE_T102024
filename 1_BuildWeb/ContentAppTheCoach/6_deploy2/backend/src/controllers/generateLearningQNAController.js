const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const LEARNING_QNA_PROMPT = `You are an expert at creating English exercise content. Based on the given structure and phrases, generate a JSON response with English sentences where specific words are hidden.

Instructions:
- Create English sentences by replacing the blank in the structure with each phrase
- For each sentence, provide a fully blanked out version with underscores matching character counts

Important: In each "sentence_hide" field, ensure the length of underscores matches the number of characters of the hidden word(s).

Example Input:
{
    "structure": "My greatest weakness is lack of _______.",
    "phrases": ["English skills", "flexibility", "confidence"]
}

Expected Output:
[
    {
        "description": "TRẢ LỜI THEO TRANH GỢI Ý",
        "sentence_en": "My greatest weakness is lack of English skills.",
        "sentence_hide": "__ ________ ________ __ ____ __ _______ ______ ."
    },
    {
        "description": "TRẢ LỜI THEO TRANH GỢI Ý", 
        "sentence_en": "My greatest weakness is lack of flexibility.",
        "sentence_hide": "__ ________ ________ __ ____ __ ___________ ."
    },
    {
        "description": "TRẢ LỜI THEO TRANH GỢI Ý",
        "sentence_en": "My greatest weakness is lack of confidence.",
        "sentence_hide": "__ ________ ________ __ ____ __ __________ ."
    }
]`;

exports.generateLearningQNA = async (req, res) => {
    try {
        console.log('Received request for QNA phrases:', req.body);
        
        const { lessons } = req.body;
        const allResults = [];
        
        for (const lesson of lessons) {
            console.log('Processing QNA lesson:', lesson);
            
            const lessonPrompt = JSON.stringify({
                structure: lesson.structure,
                phrases: [
                    lesson["main phrase"],
                    lesson["optional phrase 1"],
                    lesson["optional phrase 2"]
                ]
            }, null, 2);
            
            console.log('Sending QNA prompt to OpenAI:', lessonPrompt);
            
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: LEARNING_QNA_PROMPT },
                    { role: 'user', content: lessonPrompt }
                ],
                max_tokens: 3000,
                temperature: 0
            });
            
            try {
                const content = response.choices[0].message.content;
                console.log('Raw OpenAI response:', content);
                
                const cleanedContent = content.trim().replace(/```json|```/g, '');
                console.log('Cleaned content:', cleanedContent);
                
                const lessonResults = JSON.parse(cleanedContent);
                
                if (!Array.isArray(lessonResults)) {
                    throw new Error('Response must be an array');
                }

                const validResults = lessonResults.filter(result => {
                    return result.description && 
                           result.sentence_en && 
                           result.sentence_hide;
                });

                if (validResults.length === 3) {
                    allResults.push(...validResults);
                } else {
                    throw new Error(`Expected 3 valid results, got ${validResults.length}`);
                }
            } catch (parseError) {
                console.error('Parse error:', parseError);
                throw parseError;
            }
        }
        
        console.log('Successfully generated QNA phrases:', allResults.length);
        res.json(allResults);
        
    } catch (error) {
        console.error('Error in generateLearningQNA:', error);
        res.status(500).json({ error: error.message });
    }
};