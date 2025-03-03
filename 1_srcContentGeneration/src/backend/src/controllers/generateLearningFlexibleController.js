const OpenAI = require('openai');
const { BATCH_SIZE, MAX_TOKENS } = require('../config/batchConfig');
const { MAX_CONCURRENT_REQUESTS, ENABLE_PARALLEL_LOGGING, formatTimestamp } = require('../config/maxWorkers');
const { processInParallelBatches } = require('../utils/openaiProcessor');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const NEW_PROMPT = `You are an expert at creating English exercise content. 
You sẽ được cung cấp 1 'question', 1 'structure', and 3 'phrases'. 
Ví dụ input:
{
  "question": "Which company are you working for?",
  "structure": "I'm the ______ from ABC Company.",
  "phrases": ["Sales representative", "Sales director", "Sales associate"]
}

Response format:
{
  "question": {
    "question": "Which company are you working for?",
    "question_vn": "Bạn đang làm việc cho công ty nào?"
  },
  "sentence": [
    {
      "sentence": "I'm the Sales representative from ABC Company.",
      "sentence_vn": "Tôi là đại diện kinh doanh của công ty ABC."
    },
    {
      "sentence": "I'm the Sales director from ABC Company.",
      "sentence_vn": "Tôi là giám đốc kinh doanh của công ty ABC."
    },
    {
      "sentence": "I'm the Sales associate from ABC Company.",
      "sentence_vn": "Tôi là nhân viên bán hàng của công ty ABC."
    }
  ]
}`

function transformToExerciseFormat(gptResponse, phrases) {
    const result = [];
    const baseSentence = gptResponse.sentence[0].sentence;
    
    // 1. Full sentence with no blanks (first phrase)
    result.push({
        description: "Hãy nghe mình nói và đọc lại",
        sentence_hide: gptResponse.sentence[0].sentence,
        sentence_en: gptResponse.sentence[0].sentence,
        sentence_vi: gptResponse.sentence[0].sentence_vn
    });

    // 2-4. Phrases with exact underscore lengths
    phrases.forEach((phrase, i) => {
        result.push({
            description: i === 0 ? "Nhắc lại nhé" : "Hãy dịch câu sau",
            sentence_hide: gptResponse.sentence[i].sentence.replace(phrase, 
                phrase.split(' ').map(word => '_'.repeat(word.length)).join(' ')
            ),
            sentence_en: gptResponse.sentence[i].sentence,
            sentence_vi: gptResponse.sentence[i].sentence_vn
        });
    });
    // 5-7. Tạo các câu với phần trước phrase được thay bằng dấu gạch dưới
    phrases.forEach((phrase, i) => {
        // Lấy câu hiện tại từ kết quả GPT
        const currentSentence = gptResponse.sentence[i].sentence;
        // Tìm vị trí của phrase trong câu
        const phraseIndex = currentSentence.indexOf(phrase);
        
        if (phraseIndex !== -1) {
            // Lấy phần text trước phrase
            const beforePhrase = currentSentence.substring(0, phraseIndex);
            
            // Thay thế các ký tự thành dấu gạch dưới nhưng giữ nguyên khoảng trắng
            const maskedBefore = beforePhrase
                .split('') // Tách chuỗi thành mảng ký tự
                .map(char => char === ' ' ? ' ' : '_') // Thay thế ký tự bằng _ trừ khoảng trắng
                .join(''); // Nối lại thành chuỗi
                
            // Giữ nguyên phrase và phần text sau nó
            const remainingText = currentSentence.substring(phraseIndex);
            
            // Thêm kết quả vào mảng
            result.push({
                description: "Hãy dịch câu sau",
                sentence_hide: maskedBefore + remainingText, // Kết hợp phần đã che và phần còn lại
                sentence_en: currentSentence, // Câu gốc tiếng Anh
                sentence_vi: gptResponse.sentence[i].sentence_vn // Bản dịch tiếng Việt
            });
        }
    });
    // 8. Question with exact underscore lengths for each word
    const questionWords = gptResponse.question.question.split(' ');
    const questionHide = questionWords
        .map(word => '_'.repeat(word.length))
        .join(' ') + '?';

    result.push({
        description: "Hãy dịch câu sau",
        sentence_hide: questionHide,
        sentence_en: gptResponse.question.question,
        sentence_vi: gptResponse.question.question_vn
    });

    return result;
}

/**
 * Process a single lesson with OpenAI
 * @param {Object} lesson - The lesson data to process
 * @returns {Promise<Array>} - Promise resolving to lesson results
 */
async function processLesson(lesson) {
    if (ENABLE_PARALLEL_LOGGING) {
        console.log(`${formatTimestamp()} Sending request to OpenAI for flexible lesson`);
    }
    
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: NEW_PROMPT },
            { role: 'user', content: JSON.stringify(lesson) }
        ],
        max_tokens: MAX_TOKENS,
        temperature: 0
    });
    
    if (ENABLE_PARALLEL_LOGGING) {
        console.log(`${formatTimestamp()} Received response from OpenAI for flexible lesson`);
    }
    
    const gptResponse = JSON.parse(response.choices[0].message.content);
    const exerciseResults = transformToExerciseFormat(gptResponse, lesson.phrases);
    
    if (exerciseResults.length !== 8) {
        throw new Error(`Expected 8 results, got ${exerciseResults.length}`);
    }
    
    return exerciseResults;
}

exports.generateFlexibleCard = async (req, res) => {
    try {
        const { lessons } = req.body;
        
        // Process all lessons in parallel with batching
        const allResults = await processInParallelBatches(
            lessons,
            processLesson,
            { 
                batchSize: MAX_CONCURRENT_REQUESTS,
                itemType: 'flexible',
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
        console.error(`${formatTimestamp()} Error in generateFlexibleCard:`, error);
        res.status(500).json({ error: error.message });
    }
};