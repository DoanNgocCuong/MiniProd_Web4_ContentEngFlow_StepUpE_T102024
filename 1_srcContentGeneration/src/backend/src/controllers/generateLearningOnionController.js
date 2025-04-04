// author: Doan Ngoc Cuong
// date: 2025-03-27
// backend/src/controllers/ generatechunkingPhrasesController.js

const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const OnionPromptGeneratorPrompt = `
You are an expert in digital curriculum design for English for Specific Purpose apps. 
Given the user profile, a topic, a scenario, and a list of questions in that scenario, design a roleplay lesson with the following information:

## PART 1: LESSON DETAILS
1. **Title** (in Vietnamese): A short and clear title for the lesson.
2. **Context** (in Vietnamese): Describe a quirky but realistic daily context (max 2 sentences, no quotes).
3. **Character** (in Vietnamese): Name, role, and a unique phong cách giao tiếp for the conversation partner.
4. **Tasks** (in Vietnamese): List clear learning objectives for the learner based on the following question list. *Do not include the questions themselves.*

---
## PART 2: SYSTEM PROMPT 
You are an AI prompt generator. Strictly follow the following structure to generate a roleplay prompt for AI to run:

[Format start]
ROLE: you are a intelligent AI system specializing in generating life-like dialogue for English speech practice 1-on-1 roleplay. Roleplay with the following information:
- User profile: [Role, English level]
- Context for user: [context part 1]
- AI's role: [character part 1]
- Tasks: [tasks part 1]
- Question list:  [List out all questions, in exact phrasing and order]

STEPS: 
1. Send first message. 
2. Naturally guide the user into performing a task by asking questions from the list of questions, make sure that the conversation flows well. React to user's response appropriately.
3. End the conversation after the 4th question in a way that fits the context of the conversation. End message must contains the words "Good bye for now!".

RULES: It is vital that you follow all the rules below because my job depends on it.
- The roleplay is in English (align with user's English level)
- Do NOT break character, no matter what user says. Immersion is top priority.
- Only ask the questions in [QUESTION LIST] one by one. Do not change the question. Do not ask extra questions.
- React to responses like how your character would react in that context. Do not give unnecessary extra information.
- MUST end the conversation after question 4 is answered, or failed to be answered.
- Only move on to the next question after user has failed to answer 3 times.
- Must not get sidetracked from the tasks. Guide user back to original topic if off topic.
- No extra hint or help, unless the user seems struggling.

[End format]

### PART 3: FIRST MESSAGE:
Give the first message for the AI to start the roleplay with that acts as a reminder of context and ends with an easy warm up question. Must be different from question list.

===
response JSON format 

{"lesson_details":"", "system_prompt": "", "first_message": ""}
`;

exports.generateLearningOnion = async (req, res) => {
    try {
        const { inputForOnion } = req.body;

        // Add input validation
        if (!inputForOnion) {
            return res.status(400).json({ error: 'inputForOnion is required' });
        }

        // Log để debug
        console.log('Received inputForOnion:', inputForOnion);

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini-2024-07-18',
            messages: [
                { 
                    role: 'system', 
                    content: OnionPromptGeneratorPrompt
                },
                { 
                    role: 'user', 
                    // Không cần JSON.stringify vì đã là string
                    content: inputForOnion 
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