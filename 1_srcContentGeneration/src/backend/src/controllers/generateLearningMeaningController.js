const OpenAI = require('openai');
const { MAX_CONCURRENT_REQUESTS, ENABLE_PARALLEL_LOGGING, formatTimestamp } = require('../config/maxWorkers');
const { processInParallelBatches } = require('../utils/openaiProcessor');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const LEARNING_MEANING_PROMPT = `**Prompt:**  
You are an expert at creating English exercise content. You will receive \`CẤU TRÚC\`, \`MAIN PHRASE\`, and \`OTHER PHRASE\` inputs from the user.

**Instructions:**  
1. For each phrase:
   - Use \`answer_1\` as the exact \`MAIN PHRASE\` or \`OTHER PHRASE\`.
   - Provide alternatives for \`answer_2\` and \`answer_3\` with phrases close in meaning but incorrect.
2. For each incorrect answer:
   - Feedback format: "<r>[English word]</r> mang nghĩa là "[Nghĩa tiếng Việt]" nên sai nghĩa so với yêu cầu của đề bài." 

**Response Format:** Output only in JSON format with no extra characters (not include \`\`\`json).

**Example Input:**  
{
    "structure": "I'm the ______ from ABC Company.",
    "mainPhrase": "Sales representative",
    "optionalPhrase": "Sales director"
}

**Expected Output:** (Feedback FORMAT: <r>[English word]</r> mang nghĩa là "[Nghĩa tiếng Việt]" nên sai nghĩa so với yêu cầu của đề bài.)
[
    {
        "sentence": "I'm the <g>Đại diện kinh doanh</g> from ABC Company.",
        "answer_1": "Sales representative",
        "answer_2": "Business representative",
        "answer_3": "Sales agent",
        "answer_2_description": "<r>Business representative</r> mang nghĩa là 'đại diện kinh doanh chung' nên sai nghĩa so với yêu cầu của đề bài.",
        "answer_3_description": "<r>Sales agent</r> mang nghĩa là 'đại diện bán hàng hợp đồng' nên sai nghĩa so với yêu cầu của đề bài."
    },
    {
        "sentence": "I'm the <g>Giám đốc kinh doanh</g> from ABC Company.",
        "answer_1": "Sales director",
        "answer_2": "Sales manager",
        "answer_3": "Commercial director",
        "answer_2_description": "<r>Sales manager</r> mang nghĩa là 'quản lý kinh doanh' nên sai nghĩa so với yêu cầu của đề bài.",
        "answer_3_description": "<r>Commercial director</r> mang nghĩa là 'giám đốc thương mại' nên sai nghĩa so với yêu cầu của đề bài."
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
    
    if (Array.isArray(lessonResults) && lessonResults.length === 2) {
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

        if (validResults.length === 2) {
            return validResults;
        } else {
            console.error('Expected 2 valid results, got:', validResults.length);
            throw new Error('Invalid number of results from OpenAI');
        }
    } else {
        console.error('Invalid response format:', lessonResults);
        throw new Error('Response must be an array with exactly 2 learning meaning objects');
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
