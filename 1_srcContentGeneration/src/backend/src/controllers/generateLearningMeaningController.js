const OpenAI = require('openai');
const { MAX_CONCURRENT_REQUESTS, ENABLE_PARALLEL_LOGGING, formatTimestamp } = require('../config/maxWorkers');
const { processInParallelBatches } = require('../utils/openaiProcessor');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Chuyển chuỗi prompt thành function để tránh lỗi biến không định nghĩa
const getLearningMeaningPrompt = () => `You are an **English Learning Content Generator**.

📋 INPUT:
- structure: English sentence with blanks (____).
- mainPhrase: Main English phrase to learn.
- optionalPhrase: Additional English phrase to learn.

🎯 TASK: Create 3 learning objects with these EXACT formats:

OBJECT 1: Must have these properties:
- answer_1: MUST BE structure with blanks - EXACTLY as provided in input
- sentence: Use <g> tags for Vietnamese parts

OBJECT 2: Must have these properties:
- answer_1: MUST BE mainPhrase - EXACTLY as provided in input
- sentence: Use <g> tags for Vietnamese parts

OBJECT 3: Must have these properties:
- answer_1: MUST BE optionalPhrase - EXACTLY as provided in input
- sentence: Use <g> tags for Vietnamese parts

⚠️ CRITICAL: THE FIRST PROPERTY MUST BE answer_1 AND IT MUST MATCH THE EXACT INPUT!

Return only valid JSON array with 3 objects. Example:
[
  {
    "answer_1": "<structure>",
    "sentence": "<g>Vietnamese translation of structure</g> <mainPhrase> <g>remaining translation</g>.",
    "answer_2": "<incorrect alternative 1>",
    "answer_3": "<incorrect alternative 2>",
    "answer_2_description": "<r>Incorrect alternative 1</r> mang nghĩa là 'Vietnamese meaning' nên sai so với yêu cầu.",
    "answer_3_description": "<r>Incorrect alternative 2</r> mang nghĩa là 'Vietnamese meaning' nên sai so với yêu cầu."
  },
  {
    "answer_1": "<mainPhrase>",
    "sentence": "<structure> <g>Vietnamese translation of mainPhrase</g>.",
    "answer_2": "<incorrect synonym 1>",
    "answer_3": "<incorrect synonym 2>",
    "answer_2_description": "<r>Incorrect synonym 1</r> mang nghĩa là 'Vietnamese meaning' nên sai so với yêu cầu.",
    "answer_3_description": "<r>Incorrect synonym 2</r> mang nghĩa là 'Vietnamese meaning' nên sai so với yêu cầu."
  },
  {
    "answer_1": "<optionalPhrase>",
    "sentence": "<structure> <g>Vietnamese translation of optionalPhrase</g>.",
    "answer_2": "<incorrect synonym 1>",
    "answer_3": "<incorrect synonym 2>",
    "answer_2_description": "<r>Incorrect synonym 1</r> mang nghĩa là 'Vietnamese meaning' nên sai so với yêu cầu.",
    "answer_3_description": "<r>Incorrect synonym 2</r> mang nghĩa là 'Vietnamese meaning' nên sai so với yêu cầu."
  }
]


📝 VÍ DỤ 1 - EXAMPLE 1: 

INPUT:
- structure: "I'm the ______ from ABC Company."
- mainPhrase: "Sales representative"
- optionalPhrase: "Sales director"
- structureVi: "Tôi là ______ từ công ty ABC."
- mainPhraseVi: "Đại diện kinh doanh"
- optionalPhraseVi: "Giám đốc kinh doanh"

OUTPUT:     
[
  {
    "answer_1": "I'm the ______ from ABC Company.",
    "sentence": "<g>Tôi là</g> business representative <g>từ công ty ABC</g>.",
    "answer_2": "I'm not the ______ from ABC Company.",
    "answer_3": "I don't work for ABC company as ______.",
    "answer_2_description": "<r>I'm not the ______ from ABC Company</r> mang nghĩa là 'tôi không phải là ______ từ công ty ABC' nên sai nghĩa so với yêu cầu của đề bài.",
    "answer_3_description": "<r>I don't work for ABC company as ______</r> mang nghĩa là 'tôi không làm việc cho công ty ABC với vai trò ______' nên sai nghĩa so với yêu cầu của đề bài."
  },
  {
    "answer_1": "Sales representative",
    "sentence": "I'm the <g>Đại diện kinh doanh</g> from ABC Company.",
    "answer_2": "Business representative",
    "answer_3": "Sales agent",
    "answer_2_description": "<r>Business representative</r> mang nghĩa là 'đại diện kinh doanh chung' nên sai nghĩa so với yêu cầu của đề bài.",
    "answer_3_description": "<r>Sales agent</r> mang nghĩa là 'đại diện bán hàng hợp đồng' nên sai nghĩa so với yêu cầu của đề bài."
  },
  {
    "answer_1": "Sales director",
    "sentence": "I'm the <g>Giám đốc kinh doanh</g> from ABC Company.",
    "answer_2": "Sales manager",
    "answer_3": "Commercial director",
    "answer_2_description": "<r>Sales manager</r> mang nghĩa là 'quản lý kinh doanh' nên sai nghĩa so với yêu cầu của đề bài.",
    "answer_3_description": "<r>Commercial director</r> mang nghĩa là 'giám đốc thương mại' nên sai nghĩa so với yêu cầu của đề bài."
  }
]
`;

/**
 * Process a single lesson with OpenAI
 * @param {Object} lesson - The lesson data
 * @returns {Promise<Array>} - Promise resolving to lesson results
 */
async function processLesson(lesson) {
    // Log input data from lesson
    console.log('========= LEARNING MEANING INPUT DATA =========');
    console.log('Original lesson:', {
        structure: lesson.structure,
        "main phrase": lesson["main phrase"],
        "optional phrase 1": lesson["optional phrase 1"],
        "structure-vi": lesson["structure-vi"],
        "main phrase-vi": lesson["main phrase-vi"],
        "optional phrase 1-vi": lesson["optional phrase 1-vi"]
    });
    
            const lessonPrompt = JSON.stringify({
                structure: lesson.structure,
                mainPhrase: lesson["main phrase"],
                optionalPhrase: lesson["optional phrase 1"],
                structureVi: lesson["structure-vi"],
                mainPhraseVi: lesson["main phrase-vi"],
                optionalPhraseVi: lesson["optional phrase 1-vi"]
            }, null, 2);
    
    // Lấy prompt từ function
    const LEARNING_MEANING_PROMPT = getLearningMeaningPrompt();
    
    // Log formatted prompt being sent to OpenAI
    console.log('Formatted prompt data:', JSON.parse(lessonPrompt));
    console.log('Full prompt:', LEARNING_MEANING_PROMPT);
    console.log('==============================================');
    
    if (ENABLE_PARALLEL_LOGGING) {
        console.log(`${formatTimestamp()} Sending request to OpenAI for lesson`);
    }
            
            const response = await openai.chat.completions.create({
        model: 'gpt-4o',
                messages: [
                    { 
                        role: 'system', 
                        content: LEARNING_MEANING_PROMPT 
                    },
                    { role: 'user', content: lessonPrompt }
                ],
        max_tokens: 4096,
                temperature: 0
            });
            
    if (ENABLE_PARALLEL_LOGGING) {
        console.log(`${formatTimestamp()} Received response from OpenAI for lesson`);
    }
    
                const content = response.choices[0].message.content;
                const cleanedContent = content.trim().replace(/```json|```/g, '');
    
    // Log response before parsing
    console.log('========= LEARNING MEANING OUTPUT DATA =========');
    console.log('Raw response:', content);
    console.log('Cleaned response:', cleanedContent);
    
    try {
                const lessonResults = JSON.parse(cleanedContent);
        console.log('Parsed results structure:', {
            isArray: Array.isArray(lessonResults),
            length: lessonResults.length,
            hasProps: lessonResults.map(item => ({
                hasAnswer1: !!item.answer_1,
                hasSentence: !!item.sentence,
                hasAnswer2: !!item.answer_2,
                hasAnswer3: !!item.answer_3,
                hasDesc2: !!item.answer_2_description,
                hasDesc3: !!item.answer_3_description
            }))
        });
        console.log('==============================================');
        
        if (Array.isArray(lessonResults) && lessonResults.length >= 3) {
            // Sửa lỗi nếu cần
            const fixedResults = fixLearningResults(lessonResults, lesson);
            
            const validResults = fixedResults.filter(result => {
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

            if (validResults.length >= 3) {
                return validResults;
                    } else {
                console.error('Expected at least 3 valid results, got:', validResults.length);
                        throw new Error('Invalid number of results from OpenAI');
                    }
                } else {
                    console.error('Invalid response format:', lessonResults);
            throw new Error('Response must be an array with at least 3 learning meaning objects');
        }
    } catch (error) {
        console.error('Error parsing response:', error);
        throw error;
    }
}

// Thêm hàm kiểm tra và sửa lỗi kết quả
function fixLearningResults(lessonResults, lesson) {
    // Deep copy để không thay đổi dữ liệu gốc
    const fixedResults = JSON.parse(JSON.stringify(lessonResults));
    
    // Đảm bảo answer_1 đúng cho từng object nhưng KHÔNG thay đổi sentence
    if (fixedResults[0]) {
        fixedResults[0].answer_1 = lesson.structure;
        console.log('Fixed Object 1 answer_1 to:', fixedResults[0].answer_1);
        // KHÔNG thay đổi sentence của Object 1
    }
    
    if (fixedResults[1]) {
        fixedResults[1].answer_1 = lesson["main phrase"];
        console.log('Fixed Object 2 answer_1 to:', fixedResults[1].answer_1);
        // Không cần thay đổi sentence vì model đã tạo đúng
    }
    
    if (fixedResults[2]) {
        fixedResults[2].answer_1 = lesson["optional phrase 1"];
        console.log('Fixed Object 3 answer_1 to:', fixedResults[2].answer_1);
        // Không cần thay đổi sentence vì model đã tạo đúng
    }
    
    return fixedResults;
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
        
        console.log('FINAL RESPONSE TO FRONTEND:', JSON.stringify(allResults));
        res.json(allResults);
    } catch (error) {
        console.error(`${formatTimestamp()} Error in generateLearningMeaning:`, error);
        res.status(500).json({ 
            error: error.message,
            details: error.stack
        });
    }
};
