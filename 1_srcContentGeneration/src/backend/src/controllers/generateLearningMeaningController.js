const OpenAI = require('openai');
const { MAX_CONCURRENT_REQUESTS, ENABLE_PARALLEL_LOGGING, formatTimestamp } = require('../config/maxWorkers');
const { processInParallelBatches } = require('../utils/openaiProcessor');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const LEARNING_MEANING_PROMPT = `**Prompt:**  
You are an expert at creating English exercise content. You will receive input with sentences in English or Vietnamese.

**Instructions:**  
1. For each input, you will generate exactly ONE learning object.
2. For each sentence with a phrase marked by <g> tags:
   - The phrase inside <g> tags is the target phrase to be translated.
   - If the phrase in <g> is in Vietnamese, answer_1 should be its ENGLISH translation.
   - If the phrase in <g> is in English, answer_1 should be its VIETNAMESE translation.
3. CRITICAL: answer_1 MUST ALWAYS be the correct translation of ONLY the content inside <g> tags.
4. For answer_2 and answer_3, provide similar but incorrect translations.
5. Write feedback for incorrect answers as: "<r>[Incorrect answer]</r> mang nghĩa là '[Vietnamese meaning]' nên sai nghĩa so với yêu cầu của đề bài."

**Examples:**
- For sentence "I want to <g>play games</g>", answer_1 MUST BE "play games"
- For sentence "<g>đi ra ngoài</g> go out", answer_1 MUST BE "go out"
- For sentence "I <g>go to school</g> everyday", answer_1 MUST BE "go to school" 

**Response Format:** Output only in JSON format with no extra characters.

**Example Input:**  
{
  "structure": "I want to ____.",
  "mainPhrase": "go out",
  "optionalPhrase": "play games"
}

**Expected Output:** 
[
  {
    "sentence": "I want to <g>đi ra ngoài</g>.",
    "answer_1": "go out",
    "answer_2": "go away",
    "answer_3": "go inside",
    "answer_2_description": "<r>go away</r> mang nghĩa là 'rời đi' nên sai nghĩa so với yêu cầu của đề bài.",
    "answer_3_description": "<r>go inside</r> mang nghĩa là 'đi vào trong' nên sai nghĩa so với yêu cầu của đề bài."
  },
  {
    "sentence": "I want to <g>chơi trò chơi</g>.",
    "answer_1": "play games",
    "answer_2": "play sports",
    "answer_3": "watch games",
    "answer_2_description": "<r>play sports</r> mang nghĩa là 'chơi thể thao' nên sai nghĩa so với yêu cầu của đề bài.",
    "answer_3_description": "<r>watch games</r> mang nghĩa là 'xem trò chơi' nên sai nghĩa so với yêu cầu của đề bài."
  }
]`;

/**
 * Process a single lesson with OpenAI
 * @param {Object} lesson - The lesson data
 * @returns {Promise<Array>} - Promise resolving to lesson results
 */
async function processLesson(lesson) {
    const lessonPrompt = JSON.stringify({
        structure: lesson.structure,
        mainPhrase: lesson["main phrase"],
        optionalPhrase: lesson["optional phrase 1"],
        structureVi: lesson["structure-vi"],
        mainPhraseVi: lesson["main phrase-vi"],
        optionalPhraseVi: lesson["optional phrase 1-vi"]
    }, null, 2);
    
    if (ENABLE_PARALLEL_LOGGING) {
        console.log(`${formatTimestamp()} Sending request to OpenAI for lesson`);
    }
    
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { 
                role: 'system', 
                content: LEARNING_MEANING_PROMPT 
            },
            { role: 'user', content: lessonPrompt }
        ],
        max_tokens: 3000,
        temperature: 0
    });
    
    if (ENABLE_PARALLEL_LOGGING) {
        console.log(`${formatTimestamp()} Received response from OpenAI for lesson`);
    }
    
    const content = response.choices[0].message.content;
    const cleanedContent = content.trim().replace(/```json|```/g, '');
    const lessonResults = JSON.parse(cleanedContent);
    
    if (Array.isArray(lessonResults) && lessonResults.length >= 2) {
        lessonResults[0].sentence = lessonResults[0].sentence.replace(
            /<g>.*?<\/g>/,
            `<g>${lesson["main phrase-vi"]}</g>`
        );
        
        if (lessonResults[1]) {
            lessonResults[1].sentence = lessonResults[1].sentence.replace(
                /<g>.*?<\/g>/,
                `<g>${lesson["optional phrase 1-vi"]}</g>`
            );
        }
        
        if (lessonResults[2] && lesson["optional phrase 2-vi"]) {
            lessonResults[2].sentence = lessonResults[2].sentence.replace(
                /<g>.*?<\/g>/,
                `<g>${lesson["optional phrase 2-vi"]}</g>`
            );
        }

        const validResults = lessonResults.filter(result => {
            const isValid = result.sentence && 
                          result.answer_1 && 
                          result.answer_2 && 
                          result.answer_3 && 
                          result.answer_2_description &&
                          result.answer_3_description;
            
            if (!isValid) {
                console.error('Invalid result structure:', result);
            }
            return isValid;
        });

        if (validResults.length >= 2) {
            return validResults;
        } else {
            console.error('Expected at least 2 valid results, got:', validResults.length);
            throw new Error('Invalid number of results from OpenAI');
        }
    } else {
        console.error('Invalid response format:', lessonResults);
        throw new Error('Response must be an array with at least 2 learning meaning objects');
    }
}

exports.generateLearningMeaning = async (req, res) => {
    try {
        const { lessons } = req.body;
        
        // Process all lessons in parallel with batching
        const allResults = await processInParallelBatches(
            lessons,
            processLesson,
            { 
                batchSize: MAX_CONCURRENT_REQUESTS,
                itemType: 'lesson',
                shouldFlatten: true
            }
        );
        
        res.json(allResults);
    } catch (error) {
        console.error(`${formatTimestamp()} Error in generateLearningMeaning:`, error);
        res.status(500).json({ 
            error: error.message,
            details: error.stack
        });
    }
};
