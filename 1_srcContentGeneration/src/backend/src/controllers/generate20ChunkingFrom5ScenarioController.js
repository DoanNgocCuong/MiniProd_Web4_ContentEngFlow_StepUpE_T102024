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
- SCENARIOS: a list of specific situations within the topic

Your task:
1. Generate **a total of 20 speaking practice questions in English** related to the topic, evenly divided among the provided scenarios.
2. Each question should be natural, relevant to the context, and appropriate for the user's English level.

============
Instruction:
- Do not include sentence structures or Vietnamese translations.
- Focus only on generating realistic, context-based **speaking questions**.
- Distribute questions **evenly across scenarios** (e.g. 4 questions per scenario if 5 scenarios).
- Questions should vary in purpose: asking for opinion, facts, experience, or suggestions.
- Avoid repeating sentence patterns.

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
            JSON.parse(content);
        } catch (e) {
            console.error('JSON parse error:', e);
            return res.status(500).json({ error: 'Invalid response format from AI' });
        }

        res.json({ chunkingPhrases: content });
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