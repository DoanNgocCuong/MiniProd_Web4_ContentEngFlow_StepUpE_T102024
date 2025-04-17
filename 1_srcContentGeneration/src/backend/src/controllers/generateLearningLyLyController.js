/**
 * @api {post} /api/generate-learning-lyly Generate Learning Context for Lyly
 * @apiName GenerateLearningLyLy
 * @apiGroup Learning
 * @apiDescription Generate a system prompt and first message for Lyly's English learning conversation
 * 
 * @apiExample {curl} Example usage:
 * # Basic usage
 * curl -X POST http://localhost:3000/api/generate-learning-lyly \
 * -H "Content-Type: application/json" \
 * -d '{
 *     "user_profile": "GIVEN INPUT:\nIndustry: [IT]\nJob: [Front-end developer]\nGender: Male\nNative language: Vietnamese\nEnglish Level: [A2]\n---\nStage: Daily-standup \nQuestion: What did you do yesterday?\n[Correct sentence]: I worked on a new feature",
 *     "first_message": "What did you do yesterday?"
 * }'
 * 
 * # With different industry and job
 * curl -X POST http://localhost:3000/api/generate-learning-lyly \
 * -H "Content-Type: application/json" \
 * -d '{
 *     "user_profile": "GIVEN INPUT:\nIndustry: [Healthcare]\nJob: [Nurse]\nGender: Female\nNative language: Vietnamese\nEnglish Level: [B1]\n---\nStage: Patient Consultation \nQuestion: How are you feeling today?\n[Correct sentence]: I am feeling better today",
 *     "first_message": "How are you feeling today?"
 * }'
 * 
 * @apiExample {json} Input Example:
 * {
 *     "user_profile": "GIVEN INPUT:\nIndustry: [IT]\nJob: [Front-end developer]\nGender: Male\nNative language: Vietnamese\nEnglish Level: [A2]\n---\nStage: Daily-standup \nQuestion: What did you do yesterday?\n[Correct sentence]: I worked on a new feature",
 *     "first_message": "What did you do yesterday?"
 * }
 * 
 * @apiExample {json} Success Response Example:
 * {
 *     "system_prompt": "You are an AI English tutor for workplace communication. 
 * 
 * You will be given:
 * - User's profile
 * - Topic: The stage/goal of the conversation
 * - Scenario: The specific discussion in which this roleplay takes place
 * - Question: This is the question asked to user
 * - Correct answer: user needs to reply with this sentence
 * - Context sentence: this is what user sees, which signals to user what the correct answer is.
 * 
 * Your task:
 * 1. Ask the user: \"first message\"
 * 2. Based on the response:
 *    - If user said [correct sentence], reply concisely and naturally without giving any new info. -> to step 3.
 *    - If user said anything else or is unclear, give feedback:
 *      - 1st time: \"Uh oh... Try answering based on the above information!\" → Ask again
 *      - 2nd time: \"Not quite... You can use a hint if you'd like. Try one more time!\" → Ask again
 *      - 3rd time: \"It's okay. The correct answer is \"[correct sentence]\". Don't forget next time!\" → Skip to the next step.
 * 3. Ask: \"Now it's your turn to ask me. Can you repeat the question I just asked?\"
 * 4. Based on the user's response:
 *    - If user said [question] correctly, answer the question concisely and naturally in the context -> then proceed to step 5.
 *    - If incorrect:
 *      - 1st attempt: \"Sorry, I didn't catch that. What was your question?\" -> let user talk again.
 *      - 2nd attempt: \"You can use the question I asked earlier. Try again!\" -> let user talk again.
 *      - 3rd attempt: \"The question is \"[question]\". Don't worry, we can try again later!\" -> skip to step 5.
 * 5. Close: \"Vậy là bạn đã hoàn thành bài học. Lần sau trò chuyện tiếp nha!\"
 * 
 * ====
 * GIVEN INPUT:
 * Industry: [IT]
 * Job: [Front-end developer]
 * Gender: Male
 * Native language: Vietnamese
 * English Level: [A2]
 * ---
 * Stage: Daily-standup 
 * Question: What did you do yesterday?
 * [Correct sentence]: I worked on a new feature
 * ---
 * Context sentence: \"Bạn vừa làm một tính năng lưu cụm mới cho app Job Speak. PM nhắn tin hỏi bạn ...\"",
 *     "first_message": "What did you do yesterday?"
 * }
 * 
 * @apiFlow
 * 1. Input Processing
 *    - Accepts user_profile text and first_message
 *    - Validates required inputs
 * 
 * 2. Context Generation
 *    - Uses OpenAI to generate a context sentence based on user_profile
 *    - The context sentence helps set the scene for the conversation
 *    - Example: "Bạn vừa làm một tính năng lưu cụm mới cho app Job Speak. PM nhắn tin hỏi bạn ..."
 * 
 * 3. System Prompt Construction
 *    - Combines the base Lyly template with:
 *      - User profile information
 *      - Generated context sentence
 *      - Learning structure
 *    - Creates a complete instruction set for Lyly's behavior
 * 
 * 4. Response Generation
 *    - Returns the complete system prompt and first message
 *    - The system prompt will guide Lyly's conversation flow
 * 
 * @apiFlowExample
 * Input:
 * {
 *     "user_profile": "GIVEN INPUT:\nIndustry: [IT]\nJob: [Front-end developer]...",
 *     "first_message": "What did you do yesterday?"
 * }
 * 
 * Process:
 * 1. Validate inputs
 * 2. Generate context using OpenAI
 * 3. Construct system prompt
 * 4. Return response
 * 
 * Output:
 * {
 *     "system_prompt": "...",
 *     "first_message": "What did you do yesterday?"
 * }
 * 
 * @apiParam {String} user_profile Text input containing user information and learning context in the following format:
 * ```
 * GIVEN INPUT:
 * Industry: [IT]
 * Job: [Front-end developer]
 * Gender: Male
 * Native language: Vietnamese
 * English Level: [A2]
 * ---
 * Stage: Daily-standup 
 * Question: What did you do yesterday?
 * [Correct sentence]: I worked on a new feature
 * ```
 * @apiParam {String} first_message The first message that Lyly will use to start the conversation
 * 
 * @apiSuccess {String} system_prompt The complete system prompt for Lyly, including:
 * - Base conversation template
 * - User profile information
 * - Generated context sentence
 * - Learning structure and information
 * @apiSuccess {String} first_message The first message to start the conversation
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "system_prompt": "You are an AI English tutor...",
 *         "first_message": "What did you do yesterday?"
 *     }
 * 
 * @apiError {Object} Error Error response object
 * @apiError {String} Error.error Error type
 * @apiError {String} Error.message Error message
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "user_profile and first_message are required"
 *     }
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *         "error": "Internal server error",
 *         "message": "Error details here"
 *     }
 */

// author: Doan Ngoc Cuong
// date: 2025-04-17
// backend/src/controllers/ generateLearningLyLyController.js

const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const ContextLyLyPromptGeneratorPrompt = `
You are guiding a roleplay exercise for an ESL app user
Given an industry, a profession, a topic, a scenario, a question, and a correct answer.
The question will be asked to user following this context sentence.
Task: Generate a quick roleplay context sentence to signal to user what the correct information chunk is. No need to repeat scenario (e.g. daily stand-up) as user already knows. Tailor the details to user profile (but don't mention their role) so user feels immersed. Follow this format:
Context: [1 scenario sentence only]

Example input:
Industry: IT
Profession: Developer
Topic: Daily Stand-up
Scenario: Hỏi về các công việc đã hoàn thành hôm qua
Question: What did you do yesterday?
Correct structure: I worked on [information chunk]
Correct information chunk: a new feature

Example output:
Context sentence: "Bạn vừa làm một tính năng lưu cụm mới cho app Job Speak. PM nhắn tin hỏi bạn ..."
`;

const LyLySystemPromptTemplate = `
You are an AI English tutor for workplace communication. 

You will be given:
- User's profile
- Topic: The stage/goal of the conversation
- Scenario: The specific discussion in which this roleplay takes place
- Question: This is the question asked to user
- Correct answer: user needs to reply with this sentence
- Context sentence: this is what user sees, which signals to user what the correct answer is.

Your task:
1. Ask the user: "first message"
2. Based on the response:
   - If user said [correct sentence], reply concisely and naturally without giving any new info. -> to step 3.
   - If user said anything else or is unclear, give feedback:
     - 1st time: "Uh oh... Try answering based on the above information!" → Ask again
     - 2nd time: "Not quite... You can use a hint if you'd like. Try one more time!" → Ask again
     - 3rd time: "It's okay. The correct answer is "[correct sentence]". Don't forget next time!" → Skip to the next step.
3. Ask: "Now it's your turn to ask me. Can you repeat the question I just asked?"
4. Based on the user's response:
   - If user said [question] correctly, answer the question concisely and naturally in the context -> then proceed to step 5.
   - If incorrect:
     - 1st attempt: "Sorry, I didn't catch that. What was your question?" -> let user talk again.
     - 2nd attempt: "You can use the question I asked earlier. Try again!" -> let user talk again.
     - 3rd attempt: "The question is "[question]". Don't worry, we can try again later!" -> skip to step 5.
5. Close: "Vậy là bạn đã hoàn thành bài học. Lần sau trò chuyện tiếp nha!"
`;

exports.generateLearningLyLy = async (req, res) => {
    try {
        const { user_profile, first_message } = req.body;

        // Add input validation
        if (!user_profile || !first_message) {
            return res.status(400).json({ error: 'user_profile and first_message are required' });
        }

        // Log để debug
        console.log('Received user_profile:', user_profile);
        console.log('Received first_message:', first_message);

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini-2024-07-18',
            messages: [
                { 
                    role: 'system', 
                    content: ContextLyLyPromptGeneratorPrompt
                },
                { 
                    role: 'user', 
                    content: user_profile
                }
            ],
            max_tokens: 4096,
            temperature: 0
        });

        const context = response.choices[0].message.content;
        
        // Log để debug
        console.log('Generated context:', context);

        // Combine the generated context with the Lyly system prompt template
        const system_prompt = LyLySystemPromptTemplate + `
====
${user_profile}
---
Context sentence: "${context}"
`;

        // Return the complete system prompt and first message
        res.json({
            system_prompt: system_prompt,
            first_message: first_message
        });
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