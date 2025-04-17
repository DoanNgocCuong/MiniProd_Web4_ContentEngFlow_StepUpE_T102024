// author: Doan Ngoc Cuong
// date: 2025-03-27
// backend/src/controllers/ generatechunkingPhrasesController.js

const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const generate20Chunking5ScenarioPrompt = `
You are an English prompt generator for practical speaking practice.
You will be given:
- USER PROFILE: including Industry, Job, English Level, Learning Goals
- TOPIC: the context of the scenario
- SCENARIOS: a list of 5 specific situations within the topic

Your task:
1. Generate **4 speaking practice questions in English**  each scenario, for a total of 5 scenarios (20 questions total)
2. Each question should be natural, relevant to only the context of that scenario to avoid repetition, and appropriate for the user’s English level.
============
Instruction:
- Focus only on generating realistic, context-based **speaking questions**. Language should be simple and clear, with a singular focus. Avoid double-barrel questions.
- Each question should have a distinct purpose, For example: asking for opinion, facts, experience, or suggestions.
- Questions must be unique, avoid repetition, or questions that can be answered with the same information.
- Avoid questions which ask for specific time/duration.
============
RESPONSE JSON TEMPLATE:

{
  "topic": "<Topic>",
  "scenarios": [
    {
      "scenario": "<Scenario 1>",
      "questions": [
        "<Question 1>",
        "<Question 2>",
        "<Question 3>",
        "<Question 4>"
      ]
    },
    ...
  ]
}


`;

exports.generate20ChunkingFrom5Scenario = async (req, res) => {
    try {
        const { userProfile5Scenario } = req.body;

        // Add input validation
        if (!userProfile5Scenario) {
            return res.status(400).json({ error: 'userProfile5Scenario is required' });
        }

        // Log để debug
        console.log('Received userProfile5Scenario:', userProfile5Scenario);

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { 
                    role: 'system', 
                    content: generate20Chunking5ScenarioPrompt
                },
                { 
                    role: 'user', 
                    // Không cần JSON.stringify vì đã là string
                    content: userProfile5Scenario 
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