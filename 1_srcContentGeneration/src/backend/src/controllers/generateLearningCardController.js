const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const LEARNING_CARD_PROMPT = `You are an English-Vietnamese translation expert. Create natural sentences in both languages.

Given:
1. A Vietnamese sentence template with a blank (____) 
2. Three Vietnamese phrases to fill in
3. The context and meaning

Create natural translations that:
- Maintain the meaning but use natural word order in each language
- Don't translate word-by-word
- Use correct grammar structure for each language
- For exclamatory sentences, use appropriate English exclamation patterns

Example:
Input: {
    "vi_template": "trò chơi này ____!",
    "phrases": [
        "thật thú vị",
        "thật vui",
        "thật tuyệt vời"
    ]
}

Expected Output:
[
    {
        "sentence_vi": "trò chơi này thật thú vị!",
        "sentence_en": "This game is so exciting!",
        "ipa": "/ðɪs ɡeɪm ɪz soʊ ɪkˈsaɪtɪŋ/"
    },
    {
        "sentence_vi": "trò chơi này thật vui!",
        "sentence_en": "This game is so fun!",
        "ipa": "/ðɪs ɡeɪm ɪz soʊ fʌn/"
    },
    {
        "sentence_vi": "trò chơi này thật tuyệt vời!",
        "sentence_en": "This game is amazing!",
        "ipa": "/ðɪs ɡeɪm ɪz əˈmeɪzɪŋ/"
    }
]

Note: 
- For Vietnamese sentences with "thật..." at the end, use "is so..." or "is..." pattern in English
- Keep the exclamation mark in both languages
- Maintain the natural word order in each language
- IPA should be accurate and complete
- Vietnamese word order: Subject + Adjective phrase
- English word order: Subject + is + (so) + Adjective`;

exports.generateLearningCard = async (req, res) => {
    try {
        // Debug input
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);

        // Validate input
        if (!req.body.lessons || !Array.isArray(req.body.lessons)) {
            return res.status(400).json({
                error: 'Invalid input: lessons must be an array'
            });
        }

        const { lessons } = req.body;
        const allResults = [];
        
        for (const lesson of lessons) {
            // Validate lesson structure
            if (!lesson.structure || !lesson["main phrase"]) {
                console.error('Invalid lesson structure:', lesson);
                continue; // Skip invalid lessons
            }

            try {
                const lessonPrompt = JSON.stringify({
                    structure_en: lesson.structure,
                    structure_vi: lesson["structure-vi"] || '',
                    main_phrase: lesson["main phrase"],
                    main_phrase_vi: lesson["main phrase-vi"] || '',
                    optional_phrase_1: lesson["optional phrase 1"] || '',
                    optional_phrase_1_vi: lesson["optional phrase 1-vi"] || '',
                    optional_phrase_2: lesson["optional phrase 2"] || '',
                    optional_phrase_2_vi: lesson["optional phrase 2-vi"] || ''
                }, null, 2);

                const response = await openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: LEARNING_CARD_PROMPT },
                        { role: 'user', content: lessonPrompt }
                    ],
                    max_tokens: 3000,
                    temperature: 0
                });

                if (!response.choices || !response.choices[0]) {
                    throw new Error('Invalid response from OpenAI');
                }

                const content = response.choices[0].message.content;
                console.log('OpenAI response:', content);

                const cleanedContent = content.trim().replace(/```json|```/g, '');
                const lessonResults = JSON.parse(cleanedContent);

                // Validate results
                if (!Array.isArray(lessonResults)) {
                    throw new Error('Response must be an array');
                }

                allResults.push(...lessonResults);

            } catch (lessonError) {
                console.error('Error processing lesson:', {
                    lesson,
                    error: lessonError.message
                });
                // Continue with next lesson instead of failing completely
                continue;
            }
        }

        if (allResults.length === 0) {
            return res.status(500).json({
                error: 'Failed to generate any valid results'
            });
        }

        res.json(allResults);

    } catch (error) {
        // Detailed error logging
        console.error('Full error details:', {
            message: error.message,
            stack: error.stack,
            body: req.body
        });
        res.status(500).json({ 
            error: error.message
        });
    }
};
