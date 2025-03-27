// backend/src/controllers/generateQuestionsController.js

const OpenAI = require('openai');
const { BATCH_SIZE, MAX_TOKENS } = require('../config/batchConfig');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * Prompt chuẩn để tạo câu hỏi
 */
const generateQuestionsPrompt = `
You are an expert at generating content related to English lesson topics.
Return an array of question objects in JSON format, without including any other characters such as \`\`\`JSON. 

Important rules for Vietnamese sentence structure:
                            - Always place ___ at the natural position in Vietnamese sentences
                            - For adjective phrases: Subject + ___ (correct: "trò chơi này ___", NOT: "___ trò chơi này")
                            - For verb phrases: Subject + ___ + Object (correct: "tôi ___ bài tập", NOT: "___ tôi bài tập")

Instructions: 

{
  "question": "Question text",
  "structure": "Answer format with blank (____), ONLY 1 blank for the answer",
  "main phrase": "Key phrase to fit blank (no proper nouns and must be a phrase 1, 2, 3, 4 words)", 
  "optional phrase 1": "Alternative phrase option 1 (no proper nouns and must be a phrase 1, 2, 3, 4 words)",
  "optional phrase 2": "Alternative phrase option 2 (no proper nouns and must be a phrase 1, 2, 3, 4 words)",
  "question-vi": "Vietnamese translation of question",
  "structure-vi": "Vietnamese translation of structure",
  "main phrase-vi": "Vietnamese translation of main phrase",
  "optional phrase 1-vi": "Vietnamese translation of option 1",
  "optional phrase 2-vi": "Vietnamese translation of option 2"
}

Example:
{
  "question": "Which company are you working for?",
  "structure": "I'm the ____ from ABC Company.",
  "main phrase": "Sales representative",
  "optional phrase 1": "Sales director", 
  "optional phrase 2": "Sales associate",
  "question-vi": "Bạn đang làm việc cho công ty nào vậy?",
  "structure-vi": "Tôi là ____ từ công ty ABC.",
  "main phrase-vi": "Đại diện kinh doanh",
  "optional phrase 1-vi": "Giám đốc kinh doanh",
  "optional phrase 2-vi": "Nhân viên bán hàng"
}
`;

/**
 * Kiểm tra tính hợp lệ của câu hỏi
 */
function validateQuestion(question) {
    const requiredFields = [
        'question', 'structure', 'main phrase', 
        'optional phrase 1', 'optional phrase 2',
        'question-vi', 'structure-vi', 
        'main phrase-vi', 'optional phrase 1-vi', 'optional phrase 2-vi'
    ];

    // Kiểm tra các trường bắt buộc
    for (const field of requiredFields) {
        if (!question[field]) return false;
    }

    // Kiểm tra cấu trúc câu tiếng Việt
    if (!question['structure-vi'].includes('____')) return false;

    return true;
}

/**
 * Controller để tạo câu hỏi
 * @param {Object} req - Request với format { "generateQuestionInput": "Generate 5 English questions about..." }
 * @param {Object} res - Response object
 */
exports.generateQuestions = async (req, res) => {
    try {
        const { generateQuestionInput } = req.body;

        // Validate input
        if (!generateQuestionInput) {
            return res.status(400).json({ error: 'Generate Question Input is required' });
        }

        // Lấy số lượng câu hỏi từ input
        const questionCountMatch = generateQuestionInput.match(/Generate (\d+) English/i);
        if (!questionCountMatch) {
            return res.status(400).json({ 
                error: 'Invalid input format. Should start with "Generate X English..."' 
            });
        }

        const questionCount = parseInt(questionCountMatch[1]);
        const batches = Math.ceil(questionCount / BATCH_SIZE);
        let allQuestions = [];

        // Tạo câu hỏi theo batches
        for (let i = 0; i < batches; i++) {
            const batchSize = Math.min(BATCH_SIZE, questionCount - i * BATCH_SIZE);
            const batchPrompt = generateQuestionInput.replace(/Generate \d+ English/i, `Generate ${batchSize} English`);

            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { 
                        role: 'system', 
                        content: generateQuestionsPrompt
                    },
                    { 
                        role: 'user', 
                        content: `${batchPrompt}`
                    }
                ],
                max_tokens: MAX_TOKENS,
                temperature: 0.7
            });

            const content = response.choices[0].message.content;
            let parsedContent;
            try {
                parsedContent = JSON.parse(content.trim().replace(/```json|```/g, ''));
            } catch (error) {
                console.error('JSON parsing error:', error);
                continue;
            }

            // Validate và filter câu hỏi không hợp lệ
            const validQuestions = Array.isArray(parsedContent) 
                ? parsedContent.filter(validateQuestion)
                : [parsedContent].filter(validateQuestion);

            allQuestions = allQuestions.concat(validQuestions);
        }

        // Kiểm tra số lượng câu hỏi tạo được
        if (allQuestions.length === 0) {
            return res.status(500).json({ 
                error: 'Failed to generate valid questions' 
            });
        }

        // Trả về kết quả
        res.json({ 
            questions: allQuestions,
            total: allQuestions.length,
            requestedCount: questionCount
        });

    } catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({ 
            error: error.message,
            details: 'Error generating questions'
        });
    }
};