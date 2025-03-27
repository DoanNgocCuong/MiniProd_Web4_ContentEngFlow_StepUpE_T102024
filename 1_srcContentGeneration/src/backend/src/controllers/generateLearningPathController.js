// author: Doan Ngoc Cuong
// date: 2025-03-27
// backend/src/controllers/ generateLearningPathController.js

const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const generateLearningPathPrompt = `
You are ESP learning path expert.  
Think step by step. Keep each step ≤ 5 words.  

Given user profile:  
- Industry: 
- Job:
- English Level: 
- Learning Goals: 

Your task:  
1. Describe user briefly in a few key phrases
2. List 5 groups of people this user communicates with to fulfill learning goal.
3. With each group, suggest 5 most essential types of meeting/discussion that requires good English speech to complete. (e.g. daily standup). 
4. Create 10-topic learning path:  
  * Topics = 1 type of meeting, conversation, presentation or discussion in that user's daily workflow based on above output. 
   - Ordered them most frequent first.
- Do not pick very similar topics, only unique ones.
- Topic format: English (Vietnamese translation). 2-3 words max. 
* Scenario:
  - For each topic, break it down into 5 scenarios for English speaking practice. Scenarios must be representative that topic. Must be suitable for English-speaking practice, open-ended, and have some logic in the order. The final scenario of topic should not include the words "Tóm tắt","kết thúc","thảo luận","kí kết".
   - Scenario title format : Vietnamese, 5–10 word 
5. Give the biggest milestones (concise communication tasks users have mastered) that the learner can achieve when following this learning path, at 2h, 10h, 14h, 35h, and 50h of speaking. Give a cool title for each of these milestones.

============
RESPONSE JSON TEMPLATE (no extra characters):  
{
  "user_profile_description": "...",
  "communication_partners": [
    {
      "group": "...",
      "scenarios": [
        "..."
      ]
    }
  ],
  "learning_path": [
    {
      "week": 1,
      "topic": "Tên chủ đề",
      "scenarios": [
        { "scenario": "Tên tình huống" },
        { "scenario": "..." },
        { "scenario": "..." },
        { "scenario": "..." },
        { "scenario": "..." }
      ]
    }
  ],
  "milestones": [
    {
      "time": "...",
      "english_title": "...",
      "vn_detail": "<in Vietnamese>"
    }
  ]
}

============

Use CoD:  
- Define who they talk to and for what 
- List realistic daily speaking needs  
- Build weekly learning path  
- Format JSON  
- Output only JSON  

####

=====
`;

exports.generateLearningPath = async (req, res) => {
    try {
        // Lấy user profile từ req.body
        const { userProfile } = req.body;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-2024-08-06',
            messages: [
                { 
                    role: 'system', 
                    content: generateLearningPathPrompt
                },
                { role: 'user', content: userProfile}
            ],
            max_tokens: 9000,
            temperature: 0
            });

        const content = response.choices[0].message.content;

        res.json({ learningPath: content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};