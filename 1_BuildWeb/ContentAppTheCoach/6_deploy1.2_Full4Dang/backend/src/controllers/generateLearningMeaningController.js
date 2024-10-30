const OpenAI = require('openai');

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
   - Give a short description explaining why it is incorrect, highlighting incorrect words with \`<r>...</r>\` tags.

**Response Format:** Output only in JSON format with no extra characters (not include \`\`\`json).

**Example Input:**  
{
    "structure": "I'm the ______ from ABC Company.",
    "mainPhrase": "Sales representative",
    "optionalPhrase": "Sales director"
}

**Expected Output:**
[
    {
        "sentence": "I'm the <g>Đại diện kinh doanh</g> from ABC Company.",
        "answer_1": "Sales representative",
        "answer_2": "Business representative",
        "answer_3": "Sales agent",
        "answer_2_description": "<r>Business representative</r> rộng hơn 'Đại diện kinh doanh'.",
        "answer_3_description": "<r>Sales agent</r> thường là vai trò hợp đồng, không bao hàm đầy đủ trách nhiệm của 'Sales representative'."
    },
    {
        "sentence": "I'm the <g>Giám đốc kinh doanh</g> from ABC Company.",
        "answer_1": "Sales director",
        "answer_2": "Sales manager",
        "answer_3": "Commercial director",
        "answer_2_description": "<r>Sales manager</r> là quản lý, không phải giám đốc.",
        "answer_3_description": "<r>Commercial director</r> liên quan đến hoạt động thương mại, không chuyên về kinh doanh."
    }
]`;

exports.generateLearningMeaning = async (req, res) => {
    try {
        const { lessons } = req.body;
        const allResults = [];
        
        for (const lesson of lessons) {
            const lessonPrompt = JSON.stringify({
                structure: lesson.structure,
                mainPhrase: lesson["main phrase"],
                optionalPhrase: lesson["optional phrase 1"]
            }, null, 2);
            
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
            
            try {
                const content = response.choices[0].message.content;
                // Clean JSON string
                const cleanedContent = content.trim().replace(/```json|```/g, '');
                const lessonResults = JSON.parse(cleanedContent);
                if (Array.isArray(lessonResults) && lessonResults.length === 2) {
                    // Validate cả 2 kết quả
                    const validResults = lessonResults.filter(result => {
                        const isValid = result.sentence && 
                                      result.answer_1 && 
                                      result.answer_2 && 
                                      result.answer_3 && 
                                      result.answer_2_description &&
                                      result.answer_3_description;
                        
                        // Log để debug
                        if (!isValid) {
                            console.error('Invalid result structure:', result);
                        }
                        return isValid;
                    });

                    // Kiểm tra xem có đúng 2 kết quả hợp lệ không
                    if (validResults.length === 2) {
                        allResults.push(...validResults);
                    } else {
                        console.error('Expected 2 valid results, got:', validResults.length);
                        throw new Error('Invalid number of results from OpenAI');
                    }
                } else {
                    console.error('Invalid response format:', lessonResults);
                    throw new Error('Response must be an array with exactly 2 learning meaning objects');
                }
            } catch (parseError) {
                console.error('Parse error:', parseError);
                console.error('Raw content:', response.choices[0].message.content);
                throw new Error('Failed to parse OpenAI response');
            }
        }
        
        res.json(allResults);
    } catch (error) {
        console.error('Error in generateLearningMeaning:', error);
        res.status(500).json({ 
            error: error.message,
            details: error.stack
        });
    }
};
