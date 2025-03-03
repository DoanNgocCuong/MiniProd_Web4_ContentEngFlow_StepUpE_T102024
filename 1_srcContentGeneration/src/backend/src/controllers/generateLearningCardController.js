const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const LEARNING_CARD_PROMPT = `You are an English exercise content expert. Given structure_en, main_phrase, and up to two optional_phrases, create a JSON array with:

- sentence_en: English sentence
- sentence_vi: Vietnamese translation 
- ipa: IPA pronunciation

**Response Format:** Output only in JSON format with no extra characters (such as \`\`\`Json).

**Example Input:**
{
    "structure_en": "Our team of _____ specialists is here to help",
    "main_phrase": "healthcare",
    "optional_phrase_1": "financial", 
    "optional_phrase_2": "legal"
}

Expected Output:
[
    {
        "sentence_en": "Our team of _____ specialists is here to help",
        "sentence_vi": "Đội ngũ chuyên gia _____ của chúng tôi sẵn sàng hỗ trợ",
        "ipa": "/ˈaʊər tiːm əv _____ ˈspɛʃəlɪsts ɪz hɪər tuː hɛlp/"
    },
    {
        "sentence_en": "healthcare specialists",
        "sentence_vi": "chuyên gia y tế",
        "ipa": "/ˈhɛlθˌkɛr ˈspɛʃəlɪsts/"
    },
    {
        "sentence_en": "financial specialists", 
        "sentence_vi": "chuyên gia tài chính",
        "ipa": "/faɪˈnænʃəl ˈspɛʃəlɪsts/"
    },
    {
        "sentence_en": "legal specialists",
        "sentence_vi": "chuyên gia pháp lý", 
        "ipa": "/ˈliːɡəl ˈspɛʃəlɪsts/"
    }
]`;

exports.generateLearningCard = async (req, res) => {
    try {
        // Log request data
        console.log('Received request for learning cards:', req.body);
        
        const { lessons } = req.body;
        const allResults = [];
        
        for (const lesson of lessons) {
            // Log mỗi lesson được xử lý
            console.log('Processing lesson:', lesson);
            
            const lessonPrompt = JSON.stringify({
                structure_en: lesson.structure,
                structure_vi: lesson["structure-vi"],
                main_phrase: lesson["main phrase"],
                main_phrase_vi: lesson["main phrase-vi"],
                optional_phrase_1: lesson["optional phrase 1"],
                optional_phrase_1_vi: lesson["optional phrase 1-vi"],
                optional_phrase_2: lesson["optional phrase 2"],
                optional_phrase_2_vi: lesson["optional phrase 2-vi"]
            }, null, 2);
            
            // Update the LEARNING_CARD_PROMPT to use provided Vietnamese translations
            const customPrompt = `${LEARNING_CARD_PROMPT}\n
Additional context: Use these Vietnamese translations if provided:
- Structure VI: ${lesson["structure-vi"]}
- Main Phrase VI: ${lesson["main phrase-vi"]}
- Optional Phrase 1 VI: ${lesson["optional phrase 1-vi"]}
- Optional Phrase 2 VI: ${lesson["optional phrase 2-vi"]}`;

            // Log prompt trước khi gửi tới OpenAI
            console.log('Sending prompt to OpenAI:', lessonPrompt);
            
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: customPrompt },
                    { role: 'user', content: lessonPrompt }
                ],
                max_tokens: 3000,
                temperature: 0
            });
            
            try {
                const content = response.choices[0].message.content;
                // Log raw response
                console.log('Raw OpenAI response:', content);
                
                const cleanedContent = content.trim().replace(/```json|```/g, '');
                // Log cleaned content
                console.log('Cleaned content:', cleanedContent);
                
                const lessonResults = JSON.parse(cleanedContent);
                
                // Add processing for IPA
                lessonResults.forEach(result => {
                    result.ipa = result.ipa.replace(/[_]+/g, '');
                });
                
                // Log parsed results
                console.log('Parsed results:', lessonResults);
                
                if (!Array.isArray(lessonResults)) {
                    console.error('Response is not an array:', lessonResults);
                    throw new Error('Response must be an array');
                }

                if (lessonResults.length !== 4) {
                    console.error('Invalid number of results:', lessonResults.length);
                    throw new Error('Expected exactly 4 results');
                }

                const validResults = lessonResults.filter(result => {
                    const isValid = result.sentence_en && 
                                  result.sentence_vi && 
                                  result.ipa;
                    
                    if (!isValid) {
                        console.error('Invalid result structure:', result);
                    }
                    return isValid;
                });

                if (validResults.length === 4) {
                    allResults.push(...validResults);
                } else {
                    throw new Error(`Expected 4 valid results, got ${validResults.length}`);
                }
            } catch (parseError) {
                // Log detailed parse error
                console.error('Parse error details:', {
                    error: parseError.message,
                    stack: parseError.stack,
                    content: response.choices[0].message.content
                });
                throw parseError;
            }
        }
        
        // Log final results
        console.log('Successfully generated cards:', allResults.length);
        res.json(allResults);
        
    } catch (error) {
        // Log error với stack trace
        console.error('Error in generateLearningCard:', {
            message: error.message,
            stack: error.stack
        });
        
        res.status(500).json({ 
            error: error.message,
            details: error.stack
        });
    }
};
