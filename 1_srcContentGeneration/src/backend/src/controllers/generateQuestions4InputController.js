// author: Doan Ngoc Cuong
// date: 2025-03-27
// backend/src/controllers/ generatechunkingPhrasesController.js

const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const generateQuestions4InputPrompt = `
You are an expert at generating content related to English lesson topics.
Return an array of question objects in JSON format, without including any other characters such as \`\`\`JSON. 

Important rules for Vietnamese sentence structure:
                            - Always place ___ at the natural position in Vietnamese sentences
                            - For adjective phrases: Subject + ___ (correct: "trò chơi này ___", NOT: "___ trò chơi này")
                            - For verb phrases: Subject + ___ + Object (correct: "tôi ___ bài tập", NOT: "___ tôi bài tập")

Instructions: 

{
  "question": "Question text",
  "question-vi": "Vietnamese translation of question",
  "structure": "Answer format with blank (____), ONLY 1 blank for the answer",
  "structure-vi": "Vietnamese translation of structure",
  "audio": "",
 "lesson_detail": [
{
  "phrase_eng": "Key phrase to fit blank (no proper nouns and must be a phrase 1, 2, 3, 4 words)", 
  "phrase_vi": "Vietnamese translation of main phrase", 
  "audio": ""
},
{
  "phrase_eng": "Alternative phrase option 1 (no proper nouns and must be a phrase 1, 2, 3, 4 words)", 
  "phrase_vi": "Vietnamese translation of option 1", 
  "audio": ""
},
{
  "phrase_eng": "Alternative phrase option 2 (no proper nouns and must be a phrase 1, 2, 3, 4 words)",
  "phrase_vi": "Vietnamese translation of option 2", 
},
]
}


Example:
{
  "question": "Why do you think job satisfaction is important?",
  "question-vi": "Tại sao bạn nghĩ rằng sự hài lòng trong công việc lại quan trọng?",
  "structure": "Job satisfaction is important because __.",
  "structure-vi": "Sự hài lòng trong công việc quan trọng vì __.",
  "audio": "job_satisfaction_is_important_because.mp3",
  "lesson_detail": [
    {
      "optional_phrase": "it increases productivity",
      "optional_phrase_vi": "nó tăng năng suất",
      "audio": "<>"
    },
    {
      "optional_phrase": "it improves morale",
      "optional_phrase_vi": "nó cải thiện tinh thần",
      "audio": "<>"
    },
    {
      "optional_phrase": "it reduces stress",
      "optional_phrase_vi": "nó giảm căng thẳng", 
      "audio": "<>"
    }
  ]
}
`;

exports.generateQuestions4Input = async (req, res) => {
    try {
        const { generateQuestions4Input } = req.body;

        // Add input validation
        if (!generateQuestions4Input) {
            return res.status(400).json({ error: 'generateQuestions4Input is required' });
        }

        // Log để debug
        console.log('Received generateQuestions4Input:', generateQuestions4Input);

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini-2024-07-18',
            messages: [
                { 
                    role: 'system', 
                    content: generateQuestions4InputPrompt
                },
                { 
                    role: 'user', 
                    content: typeof generateQuestions4Input === 'string' 
                        ? generateQuestions4Input 
                        : JSON.stringify(generateQuestions4Input)
                }
            ],
            max_tokens: 4096,
            temperature: 0
        });

        const content = response.choices[0].message.content;
        
        // Log để debug
        console.log('OpenAI response:', content);

        // Validate response format
        try {
            const parsedContent = JSON.parse(content);
            res.json(parsedContent);
        } catch (e) {
            console.error('JSON parse error:', e);
            return res.status(500).json({ error: 'Invalid response format from AI' });
        }
    } catch (error) {
        // Improved error handling with more details
        console.error('Detailed error:', error);
        
        if (error.response) {
            return res.status(error.response.status).json({ 
                error: 'OpenAI API error',
                message: error.response.data.error.message 
            });
        }
        
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message || 'An unexpected error occurred'
        });
    }
};