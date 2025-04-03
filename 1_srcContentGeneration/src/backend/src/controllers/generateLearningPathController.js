// author: Doan Ngoc Cuong
// date: 2025-03-27
// backend/src/controllers/ generateLearningPathController.js

const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const generateLearningPathPrompt = `
You are a expert at designing engaging and relevant English for Specific Purpose curriculum, helping learners prepare for effective English communication according to their needs.

Given user profile:  
- Industry: 
- Job:
- English Level: 
- Learning Goals:

Your task:  
1. Profile description: Describe user in a few key phrases
2. For each learning goal, give 10 unique discussion topics or types of conversation that learner need to cover. 
3. Create 10-topic learning path:  
  * Topics = pick 10 most important speaking-focused topics from the list above. 
- Ensure to spread them over all learning goals (If there is only 1 learning goal, take all 10 topics)
- Make sure they are as dissimilar as possible, both in context, purpose, and English usage.
- Make sure no written communication topics, like "emails"
- No "self introduction" topics.
- Format title: Topic title (must be in English, 2-3 words max) | [Learning goal]
- Order: most basic first, then more and more complex. 
* Scenario:
- In each topic, give me 5 open-ended scenarios in which learners have to engage in active english speech to fulfill the objective of the scenario (example: scenarios should begin with specific active speech verbs like "trình bày, báo cáo, cập nhật, thảo luận, đề xuất, đưa ra, so sánh, giải thích, mô tả, chia sẻ, thương lượng, bàn bạc, đàm phán, phân tích, đánh giá, tham gia, trả lời, điều phối) 
- Must not use non-speech scenarios (e.g. tham gia, nhận, điều chỉnh...) 
- Scenarios need to take into account the context of the topic (example: "Giới thiệu bản thân trong buổi gặp gỡ khách hàng" cannot be in the topic Self introduction | Job interview, because it doesn't serve the learning goal "job interview")
- Make sure each scenario actually requires users to use a different type of English structure, and serve an unique purpose. (For example "Giới thiệu bản thân trong buổi phỏng vấn" and "Giới thiệu bản thân trong buổi họp nhóm" only changes the context, therefore is not acceptable. Changing the context alone is NOT enough).
- Be quirky, specific, interesting.
- The order of scenarios in a topic should have some structure or step-based logic
- Make sure there are no scenarios requiring the same English structure across different topics.
- Scenario title language: Vietnamese, 5 -10 words

4. Give the biggest milestones (concise communication tasks users have mastered) that the learner can achieve when following this learning path, at 2h, 10h, 14h, 35h, and 50h of speaking. Give a cool title for each of these milestones.
============
RESPONSE JSON TEMPLATE (not include other character such as \`\`\`json):  
{
  "user_profile_description": "...",
  "discussion_topics": [
    {
      "Learning goal": "...",
      "Topics": [
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
- Format JSON  
- Output only JSON  

####
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