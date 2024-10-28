const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const LEARNING_FLEXIBLE_PROMPT = 
`You are an expert at creating English exercise content. Based on the given structure, generate a JSON response with various English sentences, where specific words are hidden to create fill-in-the-blank exercises. Translate each sentence into Vietnamese.

Instructions:
- The output should contain 8 JSON objects within a JSON array.
- JSON 1: Full sentence with no blanks.
- JSONs 2, 3, 4: Replace each phrase in turn with underscores (one JSON per phrase).
- JSONs 5, 6, 7: Only the specified phrases are visible, while the rest of the sentence is replaced by underscores.
- JSON 8: Full sentence with all words replaced by blanks.

Important: In each "sentence_hide" field, ensure the length of underscores matches the number of characters of the hidden word(s).

Example Input:
{
  "question": "Which company are you working for?",
  "structure": "I'm the ______ from ABC Company.",
  "phrases": ["Sales representative", "Sales director", "Sales associate"]
}

Expected Output:
[
  {
    "description": "Hãy nghe mình nói và đọc lại",
    "sentence_hide": "I'm the Sales representative from ABC company.",
    "sentence_en": "I'm the Sales representative from ABC company.", 
    "sentence_vi": "Tôi là đại diện kinh doanh của công ty ABC."
  },
  {
    "description": "Nhắc lại nhé",
    "sentence_hide": "I'm the _____ _____________ from ABC company.",
    "sentence_en": "I'm the Sales representative from ABC company.",
    "sentence_vi": "Tôi là đại diện kinh doanh của công ty ABC."
  },
  {
    "description": "Hãy dịch câu sau",
    "sentence_hide": "I'm the _____ _________ from ABC company.",
    "sentence_en": "I'm the Sales director from ABC company.",
    "sentence_vi": "Tôi là giám đốc kinh doanh của công ty ABC."
  },
  {
    "description": "Hãy dịch câu sau", 
    "sentence_hide": "I'm the _____ _________ from ABC company.",
    "sentence_en": "I'm the Sales associate from ABC company.",
    "sentence_vi": "Tôi là nhân viên bán hàng của công ty ABC."
  },
  {
    "description": "Hãy dịch câu sau",
    "sentence_hide": "___ ___ Sales representative from ABC company.",
    "sentence_en": "I'm the Sales representative from ABC company.",
    "sentence_vi": "Tôi là đại diện kinh doanh của công ty ABC."
  },
  {
    "description": "Hãy dịch câu sau",
    "sentence_hide": "___ ___ Sales director from ABC company.",
    "sentence_en": "I'm the Sales director from ABC company.", 
    "sentence_vi": "Tôi là giám đốc kinh doanh của công ty ABC."
  },
  {
    "description": "Hãy dịch câu sau",
    "sentence_hide": "___ ___ Sales associate from ABC company.",
    "sentence_en": "I'm the Sales associate from ABC company.",
    "sentence_vi": "Tôi là nhân viên bán hàng của công ty ABC."
  },
  {
    "description": "Hãy dịch câu sau",
    "sentence_hide": "_____ _______ ___ ___ _______ ____?",
    "sentence_en": "Which company are you working for?",
    "sentence_vi": "Bạn đang làm việc cho công ty nào vậy?"
  }
]`;

exports.generateFlexibleCard = async (req, res) => {
    try {
        console.log('Received request for flexible cards:', req.body);
        
        const { lessons } = req.body;
        const allResults = [];
        
        for (const lesson of lessons) {
            console.log('Processing flexible lesson:', lesson);
            
            const lessonPrompt = JSON.stringify({
                question: lesson.question,
                structure: lesson.structure,
                phrases: lesson.phrases
            }, null, 2);
            
            console.log('Sending flexible prompt to OpenAI:', lessonPrompt);
            
            const response = await openai.chat.completions.create({
                model: 'gpt-4-turbo-preview',
                messages: [
                    { role: 'system', content: LEARNING_FLEXIBLE_PROMPT },
                    { role: 'user', content: lessonPrompt }
                ],
                max_tokens: 3000,
                temperature: 0
            });
            
            try {
                const content = response.choices[0].message.content;
                console.log('Raw OpenAI response:', content);
                
                const cleanedContent = content.trim().replace(/```json|```/g, '');
                console.log('Cleaned content:', cleanedContent);
                
                const lessonResults = JSON.parse(cleanedContent);
                console.log('Parsed results:', lessonResults);
                
                if (!Array.isArray(lessonResults)) {
                    console.error('Response is not an array:', lessonResults);
                    throw new Error('Response must be an array');
                }

                if (lessonResults.length !== 8) {
                    console.error('Invalid number of results:', lessonResults.length);
                    throw new Error('Expected exactly 8 results');
                }

                const validResults = lessonResults.filter(result => {
                    const isValid = result.description && 
                                  result.sentence_hide && 
                                  result.sentence_en &&
                                  result.sentence_vi;
                    
                    if (!isValid) {
                        console.error('Invalid result structure:', result);
                    }
                    return isValid;
                });

                if (validResults.length === 8) {
                    allResults.push(...validResults);
                } else {
                    throw new Error(`Expected 8 valid results, got ${validResults.length}`);
                }
            } catch (parseError) {
                console.error('Parse error details:', {
                    error: parseError.message,
                    stack: parseError.stack,
                    content: response.choices[0].message.content
                });
                throw parseError;
            }
        }
        
        console.log('Successfully generated flexible cards:', allResults.length);
        res.json(allResults);
        
    } catch (error) {
        console.error('Error in generateFlexibleCard:', {
            message: error.message,
            stack: error.stack
        });
        
        res.status(500).json({ 
            error: error.message,
            details: error.stack
        });
    }
};
