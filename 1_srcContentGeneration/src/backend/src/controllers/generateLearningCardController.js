const OpenAI = require('openai');
const { BATCH_SIZE, MAX_TOKENS } = require('../config/batchConfig');
const { MAX_CONCURRENT_REQUESTS, ENABLE_PARALLEL_LOGGING, formatTimestamp } = require('../config/maxWorkers');
const { processInParallelBatches } = require('../utils/openaiProcessor');

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


/**
 * Process a single lesson with OpenAI
 * @param {Object} lesson - The lesson data to process
 * @returns {Promise<Array>} - Promise resolving to lesson results
 */
async function processLesson(lesson) {
    // Validate lesson structure
    if (!lesson.structure || !lesson["main phrase"]) {
        console.error('Invalid lesson structure:', lesson);
        throw new Error('Invalid lesson structure');
    }

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

    if (ENABLE_PARALLEL_LOGGING) {
        console.log(`${formatTimestamp()} Sending request to OpenAI for card lesson`);
    }
    
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: LEARNING_CARD_PROMPT },
            { role: 'user', content: lessonPrompt }
        ],
        max_tokens: MAX_TOKENS,
        temperature: 0
    });

    if (ENABLE_PARALLEL_LOGGING) {
        console.log(`${formatTimestamp()} Received response from OpenAI for card lesson`);
    }

    if (!response.choices || !response.choices[0]) {
        throw new Error('Invalid response from OpenAI');
    }

    const content = response.choices[0].message.content;
    const cleanedContent = content.trim().replace(/```json|```/g, '');
    const lessonResults = JSON.parse(cleanedContent);

    // Validate results
    if (!Array.isArray(lessonResults)) {
        throw new Error('Response must be an array');
    }

    return lessonResults;
}

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

        // Process all lessons in parallel with batching
        const allResults = await processInParallelBatches(
            req.body.lessons,
            processLesson,
            { 
                batchSize: MAX_CONCURRENT_REQUESTS,
                itemType: 'card',
                shouldFlatten: true
            }
        );

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

