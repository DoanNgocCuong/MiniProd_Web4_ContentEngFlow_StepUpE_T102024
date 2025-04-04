# A. API Profile user => 10 Weeks - 10 topics - 50 scenario!
```bash
curl -X POST \
  http://http://103.253.20.13:3000/api/generate-learning-path \
  -H 'Content-Type: application/json' \
  -d '{
    "userProfile": "Industry: [IT]\nJob: [CTO]\nGender: Male\nNative language: Vietnamese\nEnglish Level: [A2]\nLearning goals: [workplace communication] [job interviews] [salary review]"
}'
```

Output: 
```bash
{
    "learningPath": "```json\n{\n  \"user_profile_description\": \"Vietnamese male CTO in IT industry with A2 English level aiming to improve workplace communication, job interview skills, and salary review discussions.\",\n  \"discussion_topics\": [\n    {\n      \"Learning goal\": \"workplace communication\",\n      \"Topics\": [\n        \"Team Meetings\",\n        \"Project Updates\",\n        \"Technical Discussions\",\n        \"Problem Solving\",\n        \"Feedback Sessions\",\n        \"Client Presentations\",\n        \"Negotiating Deadlines\",\n        \"Conflict Resolution\",\n        \"Brainstorming Sessions\",\n        \"Cross-Department Collaboration\"\n      ]\n    },\n    {\n      \"Learning goal\": \"job interviews\",\n      \"Topics\": [\n        \"Interview Questions\",\n        \"Company Culture\",\n        \"Role Expectations\",\n        \"Career Goals\",\n        \"Strengths and Weaknesses\",\n        \"Past Experiences\",\n        \"Technical Skills\",\n        \"Leadership Style\",\n        \"Problem Solving Examples\",\n        \"Future Vision\"\n      ]\n    },\n    {\n      \"Learning goal\": \"salary review\",\n      \"Topics\": [\n        \"Performance Evaluation\",\n        \"Market Research\",\n        \"Salary Expectations\",\n        \"Negotiation Strategies\",\n        \"Value Proposition\",\n        \"Career Progression\",\n        \"Benefits Discussion\",\n        \"Compensation Packages\",\n        \"Peer Comparisons\",\n        \"Long-term Goals\"\n      ]\n    }\n  ],\n  \"learning_path\": [\n    {\n      \"week\": 1,\n      \"topic\": \"Team Meetings | Workplace communication\",\n      \"scenarios\": [\n        { \"scenario\": \"Thảo luận về lịch trình họp nhóm\" },\n        { \"scenario\": \"Đề xuất chủ đề cho cuộc họp nhóm\" },\n        { \"scenario\": \"Báo cáo tiến độ dự án trong cuộc họp\" },\n        { \"scenario\": \"Giải thích vấn đề kỹ thuật trong cuộc họp\" },\n        { \"scenario\": \"Đưa ra ý kiến phản hồi trong cuộc họp\" }\n      ]\n    },\n    {\n      \"week\": 2,\n      \"topic\": \"Interview Questions | Job interviews\",\n      \"scenarios\": [\n        { \"scenario\": \"Trả lời câu hỏi về kinh nghiệm làm việc\" },\n        { \"scenario\": \"Giải thích lý do muốn làm việc tại công ty\" },\n        { \"scenario\": \"Mô tả kỹ năng kỹ thuật trong phỏng vấn\" },\n        { \"scenario\": \"Đưa ra ví dụ về giải quyết vấn đề\" },\n        { \"scenario\": \"Thảo luận về phong cách lãnh đạo\" }\n      ]\n    },\n    {\n      \"week\": 3,\n      \"topic\": \"Project Updates | Workplace communication\",\n      \"scenarios\": [\n        { \"scenario\": \"Báo cáo tiến độ dự án cho quản lý\" },\n        { \"scenario\": \"Giải thích thay đổi trong kế hoạch dự án\" },\n        { \"scenario\": \"Đề xuất giải pháp cho vấn đề dự án\" },\n        { \"scenario\": \"Thảo luận về rủi ro dự án\" },\n        { \"scenario\": \"Đưa ra cập nhật hàng tuần cho nhóm\" }\n      ]\n    },\n    {\n      \"week\": 4,\n      \"topic\": \"Performance Evaluation | Salary review\",\n      \"scenarios\": [\n        { \"scenario\": \"Trình bày thành tích trong kỳ đánh giá\" },\n        { \"scenario\": \"Giải thích mục tiêu đạt được trong năm\" },\n        { \"scenario\": \"Đưa ra phản hồi về đánh giá hiệu suất\" },\n        { \"scenario\": \"Thảo luận về mục tiêu phát triển cá nhân\" },\n        { \"scenario\": \"Đề xuất cải tiến quy trình đánh giá\" }\n      ]\n    },\n    {\n      \"week\": 5,\n      \"topic\": \"Technical Discussions | Workplace communication\",\n      \"scenarios\": [\n        { \"scenario\": \"Giải thích công nghệ mới cho nhóm\" },\n        { \"scenario\": \"Thảo luận về kiến trúc hệ thống\" },\n        { \"scenario\": \"Đề xuất công cụ mới cho dự án\" },\n        { \"scenario\": \"So sánh các giải pháp kỹ thuật\" },\n        { \"scenario\": \"Đưa ra ý kiến về xu hướng công nghệ\" }\n      ]\n    },\n    {\n      \"week\": 6,\n      \"topic\": \"Salary Expectations | Salary review\",\n      \"scenarios\": [\n        { \"scenario\": \"Thảo luận về mức lương mong muốn\" },\n        { \"scenario\": \"Giải thích lý do cho mức lương đề xuất\" },\n        { \"scenario\": \"Đưa ra ví dụ về giá trị đóng góp\" },\n        { \"scenario\": \"So sánh mức lương với thị trường\" },\n        { \"scenario\": \"Đàm phán mức lương với quản lý\" }\n      ]\n    },\n    {\n      \"week\": 7,\n      \"topic\": \"Client Presentations | Workplace communication\",\n      \"scenarios\": [\n        { \"scenario\": \"Trình bày sản phẩm mới cho khách hàng\" },\n        { \"scenario\": \"Giải thích lợi ích của sản phẩm\" },\n        { \"scenario\": \"Đưa ra giải pháp cho vấn đề của khách hàng\" },\n        { \"scenario\": \"Thảo luận về phản hồi của khách hàng\" },\n        { \"scenario\": \"Đề xuất cải tiến sản phẩm dựa trên phản hồi\" }\n      ]\n    },\n    {\n      \"week\": 8,\n      \"topic\": \"Negotiation Strategies | Salary review\",\n      \"scenarios\": [\n        { \"scenario\": \"Đề xuất chiến lược đàm phán lương\" },\n        { \"scenario\": \"Thảo luận về các yếu tố ảnh hưởng đến lương\" },\n        { \"scenario\": \"Giải thích lợi ích của việc tăng lương\" },\n        { \"scenario\": \"Đàm phán các điều khoản hợp đồng\" },\n        { \"scenario\": \"Đưa ra phương án thỏa hiệp trong đàm phán\" }\n      ]\n    },\n    {\n      \"week\": 9,\n      \"topic\": \"Role Expectations | Job interviews\",\n      \"scenarios\": [\n        { \"scenario\": \"Thảo luận về trách nhiệm công việc\" },\n        { \"scenario\": \"Giải thích cách bạn đáp ứng yêu cầu công việc\" },\n        { \"scenario\": \"Đưa ra ví dụ về thành công trong vai trò tương tự\" },\n        { \"scenario\": \"Thảo luận về kỳ vọng phát triển trong vai trò\" },\n        { \"scenario\": \"Đề xuất cách cải thiện hiệu suất công việc\" }\n      ]\n    },\n    {\n      \"week\": 10,\n      \"topic\": \"Conflict Resolution | Workplace communication\",\n      \"scenarios\": [\n        { \"scenario\": \"Thảo luận về xung đột trong nhóm\" },\n        { \"scenario\": \"Đề xuất giải pháp cho xung đột\" },\n        { \"scenario\": \"Giải thích quan điểm của mình trong xung đột\" },\n        { \"scenario\": \"Thương lượng để giải quyết xung đột\" },\n        { \"scenario\": \"Đưa ra kế hoạch ngăn ngừa xung đột trong tương lai\" }\n      ]\n    }\n  ],\n  \"milestones\": [\n    {\n      \"time\": \"2h\",\n      \"english_title\": \"Meeting Maven\",\n      \"vn_detail\": \"Thành thạo thảo luận và báo cáo trong các cuộc họp nhóm.\"\n    },\n    {\n      \"time\": \"10h\",\n      \"english_title\": \"Interview Insight\",\n      \"vn_detail\": \"Nắm vững kỹ năng trả lời phỏng vấn và thảo luận về vai trò công việc.\"\n    },\n    {\n      \"time\": \"14h\",\n      \"english_title\": \"Project Pro\",\n      \"vn_detail\": \"Thành thạo báo cáo và thảo luận về tiến độ và rủi ro dự án.\"\n    },\n    {\n      \"time\": \"35h\",\n      \"english_title\": \"Negotiation Ninja\",\n      \"vn_detail\": \"Nắm vững kỹ năng đàm phán lương và đánh giá hiệu suất.\"\n    },\n    {\n      \"time\": \"50h\",\n      \"english_title\": \"Communication Connoisseur\",\n      \"vn_detail\": \"Thành thạo giao tiếp trong mọi tình huống công việc, từ thuyết trình đến giải quyết xung đột.\"\n    }\n  ]\n}\n```"
}
```
# B1. Từ User Profile + Week-1Topic-5Scenario => 20 Chunking 

http://103.253.20.13:3000/api/generate-20-chunking-from-5-scenario

```bash
{"userProfile5Scenario":"USER PROFILE:\n- Industry: undefined\n- Job: undefined\n- English Level: undefined\n- Learning Goals: undefined\n---\n{\n      \"week\": 1,\n      \"topic\": \"Project updates (Cập nhật dự án)\",\n      \"scenarios\": [{\"scenario\":\"Giới thiệu dự án mới\"},{\"scenario\":\"Thảo luận tiến độ hiện tại\"},{\"scenario\":\"Giải quyết vấn đề phát sinh\"},{\"scenario\":\"Đề xuất cải tiến dự án\"},{\"scenario\":\"Lên kế hoạch cho tuần tới\"}]\n}"}
```

```bash
{
    "chunkingPhrases": "{\n  \"topic\": \"Project updates (Cập nhật dự án)\",\n  \"scenarios\": [\n    {\n      \"scenario\": \"Giới thiệu dự án mới\",\n      \"questions\": [\n        \"Can you describe the main goal of the new project?\",\n        \"What are the key features of this project?\",\n        \"Who are the main stakeholders involved in this project?\",\n        \"What challenges do you expect to face during this project?\"\n      ]\n    },\n    {\n      \"scenario\": \"Báo cáo tiến độ hàng tuần\",\n      \"questions\": [\n        \"What progress has been made since last week?\",\n        \"Are there any tasks that are behind schedule?\",\n        \"What successes can you share from this week's work?\",\n        \"How do you plan to address any delays in the project?\"\n      ]\n    },\n    {\n      \"scenario\": \"Thảo luận vấn đề kỹ thuật\",\n      \"questions\": [\n        \"What technical issues have arisen in the project?\",\n        \"How do you think these issues can be resolved?\",\n        \"Have you consulted with any experts about these problems?\",\n        \"What impact do these technical issues have on the project timeline?\"\n      ]\n    },\n    {\n      \"scenario\": \"Đề xuất giải pháp cải tiến\",\n      \"questions\": [\n        \"What improvements do you think could enhance the project?\",\n        \"Can you suggest any tools or methods to increase efficiency?\",\n        \"How would you prioritize these improvements?\",\n        \"What feedback have you received about your proposed solutions?\"\n      ]\n    },\n    {\n      \"scenario\": \"Phản hồi từ nhóm phát triển\",\n      \"questions\": [\n        \"What feedback have you received from the development team?\",\n        \"How do you plan to incorporate their suggestions?\",\n        \"Are there any concerns raised by the team that need addressing?\",\n        \"What positive comments did the team share about the project?\"\n      ]\n    }\n  ]\n}"
}
```
---
# B2. User Profile + 1Week-1Topic-1Scenario-1Question => Detail Chunking 


http://103.253.20.13:3000/api/generate-questions

Payload:
```bash
{"generateQuestionInput":"Generate detailed content for a specific question.\n# Prepare user profile\nuser_profile = f\"\"\"USER PROFILE:\n- industry: [AI]\n- job: [CTO]\n- englishLevel: [B1]\n- learningGoals: [cdcdc]\"\"\"\n\n# Prepare question data\nquestion_data = {\n    \"topic\": \"Giới thiệu dự án hiện tại\",\n    \"scenario\": \"Giới thiệu dự án hiện tại\",\n    \"question\": \"Can you describe the main goals of the current project?\"\n}"}

```

Response:
```json
{
    "questions": [
        {
            "question": "Can you explain the main objective of the new project?",
            "structure": "The main objective of the new project is ____.",
            "main phrase": "to improve efficiency",
            "optional phrase 1": "to increase revenue",
            "optional phrase 2": "to enhance customer satisfaction",
            "question-vi": "Bạn có thể giải thích mục tiêu chính của dự án mới không?",
            "structure-vi": "Mục tiêu chính của dự án mới là ____.",
            "main phrase-vi": "cải thiện hiệu quả",
            "optional phrase 1-vi": "tăng doanh thu",
            "optional phrase 2-vi": "nâng cao sự hài lòng của khách hàng"
        }
    ],
    "total": 1,
    "requestedCount": 1
}
```

# B3. Từ each Detail Chunking => gen 4 Learning Meaning Exercise API

## 1. Generate Learning Meaning Exercise

http://103.253.20.13:3000/api/generate-learning-meaning

Input:
```json
{"lessons":[{"question":"How do you say hello in English?","structure":"You say hello by ____.","main phrase":"saying hello","optional phrase 1":"waving your hand","optional phrase 2":"smiling at someone","question-vi":"Bạn nói hello bằng cách nào trong tiếng Anh?","structure-vi":"Bạn nói hello bằng cách ____.","main phrase-vi":"nói hello","optional phrase 1-vi":"vẫy tay","optional phrase 2-vi":"mỉm cười với ai đó","lesson_id":"hello_1257_03042025"}]}
```

Response:
```json
{
    "exercises": [
        {
            "sentence": "The main objective of the new project is <b>to improve efficiency</b>.",
            "answer_1": "to improve efficiency",
            "answer_2": "to increase revenue",
            "answer_3": "to enhance customer satisfaction",
            "answer_2_description": "Incorrect. 'to increase revenue' means to make more money, which is different from improving efficiency.",
            "answer_3_description": "Incorrect. 'to enhance customer satisfaction' means to make customers happier, which is different from improving efficiency."
        }
    ]
}
```

Required Input Parameters:
- questions: Array of question objects containing:
  - question: English question text
  - structure: English sentence structure with blanks
  - main phrase: Primary phrase to fill in the blank
  - optional phrase 1: Alternative phrase 1
  - optional phrase 2: Alternative phrase 2
  - question-vi: Vietnamese question text
  - structure-vi: Vietnamese sentence structure with blanks
  - main phrase-vi: Primary phrase in Vietnamese
  - optional phrase 1-vi: Alternative phrase 1 in Vietnamese
  - optional phrase 2-vi: Alternative phrase 2 in Vietnamese
- total: Total number of questions
- requestedCount: Number of questions requested

Response Fields:
- exercises: Array of exercise objects containing:
  - sentence: The complete sentence with the correct answer highlighted in HTML
  - answer_1: The correct answer
  - answer_2: First incorrect alternative
  - answer_3: Second incorrect alternative
  - answer_2_description: Explanation for why answer_2 is incorrect
  - answer_3_description: Explanation for why answer_3 is incorrect

Exercise Features:
- Multiple choice format with 3 options
- HTML formatting for highlighting correct answers
- Explanations for incorrect answers
- Progress tracking
- Score calculation
- Navigation between exercises
- Final score display
- Exercise restart capability

## 2. Generate Learning Card Exercise

http://103.253.20.13:3000/api/generate-learning-card

Input:
```json
{"lessons":[{"question":"How do you say hello in English?","structure":"You say hello by ____.","main phrase":"saying hello","optional phrase 1":"waving your hand","optional phrase 2":"smiling at someone","question-vi":"Bạn nói hello bằng cách nào trong tiếng Anh?","structure-vi":"Bạn nói hello bằng cách ____.","main phrase-vi":"nói hello","optional phrase 1-vi":"vẫy tay","optional phrase 2-vi":"mỉm cười với ai đó","lesson_id":"hello_1257_03042025"}]}
```

Response:
```json
{
    "exercises": [
        {
            "sentence_en": "The sky is ____.",
            "sentence_vi": "Bầu trời ____.",
            "ipa": "/ðə skaɪ ɪz ____/"
        },
        {
            "sentence_en": "blue",
            "sentence_vi": "màu xanh",
            "ipa": "/bluː/"
        },
        {
            "sentence_en": "gray",
            "sentence_vi": "màu xám",
            "ipa": "/ɡreɪ/"
        },
        {
            "sentence_en": "clear",
            "sentence_vi": "trong suốt",
            "ipa": "/klɪr/"
        }
    ]
}
```

Required Input Parameters:
- lessons: Array of lesson objects containing:
  - structure: English sentence structure with blanks
  - main phrase: Primary phrase to fill in the blank
  - optional phrase 1: Alternative phrase 1
  - optional phrase 2: Alternative phrase 2
  - structure-vi: Vietnamese sentence structure with blanks
  - main phrase-vi: Primary phrase in Vietnamese
  - optional phrase 1-vi: Alternative phrase 1 in Vietnamese
  - optional phrase 2-vi: Alternative phrase 2 in Vietnamese

Response Fields:
- exercises: Array of exercise objects containing:
  - sentence_en: English sentence or word
  - sentence_vi: Vietnamese translation
  - ipa: IPA pronunciation

Exercise Features:
- Table format display
- English and Vietnamese sentences
- IPA pronunciation guide
- Edit and Delete actions
- Responsive design

## 3. Generate Flexible Phrase Exercise

curl -X POST http://103.253.20.13:3000/api/generate-learning-flexible \
-H "Content-Type: application/json" \
-d '{
  "lessons": [
    {
      "question": "How do you say hello in English?",
      "structure": "You say hello by ____.",
      "main phrase": "saying hello",
      "optional phrase 1": "waving your hand",
      "optional phrase 2": "smiling at someone",
      "question-vi": "Bạn nói hello bằng cách nào trong tiếng Anh?",
      "structure-vi": "Bạn nói hello bằng cách ____.",
      "main phrase-vi": "nói hello",
      "optional phrase 1-vi": "vẫy tay",
      "optional phrase 2-vi": "mỉm cười với ai đó",
      "lesson_id": "hello_1257_03042025"
    }
  ]
}'

Trong code backend .js co doan xu ly de lay ra. 
```bash
{
      "question": "Which company are you working for?",
      "structure": "I'\''m the ______ from ABC Company.",
      "phrases": [
        "Sales representative",
        "Sales director",
        "Sales associate"
      ]
    }
```
sau do cai nay moi duoc di qua Prompt de tra ra output

Response:
```json
{
    "exercises": [
        {
            "description": "Hãy nghe mình nói và đọc lại",
            "sentence_hide": "The sky is blue.",
            "sentence_en": "The sky is blue.",
            "sentence_vi": "Bầu trời màu xanh."
        },
        {
            "description": "Nhắc lại nhé",
            "sentence_hide": "The sky is ____.",
            "sentence_en": "The sky is blue.",
            "sentence_vi": "Bầu trời màu xanh."
        },
        {
            "description": "Hãy dịch câu sau",
            "sentence_hide": "The sky is ____.",
            "sentence_en": "The sky is gray.",
            "sentence_vi": "Bầu trời màu xám."
        },
        {
            "description": "Hãy dịch câu sau",
            "sentence_hide": "The sky is _____.",
            "sentence_en": "The sky is clear.",
            "sentence_vi": "Bầu trời trong suốt."
        },
        {
            "description": "Hãy dịch câu sau",
            "sentence_hide": "___ ___ __ blue.",
            "sentence_en": "The sky is blue.",
            "sentence_vi": "Bầu trời màu xanh."
        },
        {
            "description": "Hãy dịch câu sau",
            "sentence_hide": "___ ___ __ gray.",
            "sentence_en": "The sky is gray.",
            "sentence_vi": "Bầu trời màu xám."
        },
        {
            "description": "Hãy dịch câu sau",
            "sentence_hide": "___ ___ __ clear.",
            "sentence_en": "The sky is clear.",
            "sentence_vi": "Bầu trời trong suốt."
        },
        {
            "description": "Hãy dịch câu sau",
            "sentence_hide": "____ _____ __ ___ ____?",
            "sentence_en": "What color is the sky?",
            "sentence_vi": "Bầu trời có màu gì?"
        }
    ]
}
```

Required Input Parameters:
- lessons: Array of lesson objects containing:
  - question: The question to generate exercises from
  - structure: Base sentence structure
  - phrases: Array of phrases to use in exercises

Response Fields:
- exercises: Array of exercise objects containing:
  - description: Exercise instruction in Vietnamese
  - sentence_hide: Sentence with hidden parts (using underscores)
  - sentence_en: Complete English sentence
  - sentence_vi: Vietnamese translation

Exercise Features:
- Progressive difficulty levels:
  1. Listen and repeat (full sentence shown)
  2. Fill in blanks (partial words hidden)
  3. Translate sentences (mix of hidden and shown words)
  4. Complete sentence translation (most words hidden)
- Bilingual support (English and Vietnamese)
- Clear exercise instructions
- Edit and Delete functionality
- Table format display
- Responsive design

## 4. Generate Q&A Exercise

http://103.253.20.13:3000/api/generate-learning-qna

Input:
```json
{"lessons":[{"question":"How do you say hello in English?","structure":"You say hello by ____.","main phrase":"saying hello","optional phrase 1":"waving your hand","optional phrase 2":"smiling at someone","question-vi":"Bạn nói hello bằng cách nào trong tiếng Anh?","structure-vi":"Bạn nói hello bằng cách ____.","main phrase-vi":"nói hello","optional phrase 1-vi":"vẫy tay","optional phrase 2-vi":"mỉm cười với ai đó","lesson_id":"hello_1257_03042025"}]}
```

Response:
```json
[
    {
        "description": "TRẢ LỜI THEO TRANH GỢI Ý",
        "sentence_en": "My hat is red.",
        "sentence_hide": "___ ___ __ ___."
    }
]
```

Required Input Parameters:
- lessons: Array of lesson objects containing:
  - question: English question text
  - structure: English sentence structure with blanks
  - main phrase: Primary phrase to fill in the blank
  - optional phrase 1: Alternative phrase 1
  - optional phrase 2: Alternative phrase 2
  - question-vi: Vietnamese question text
  - structure-vi: Vietnamese sentence structure with blanks
  - main phrase-vi: Primary phrase in Vietnamese
  - optional phrase 1-vi: Alternative phrase 1 in Vietnamese
  - optional phrase 2-vi: Alternative phrase 2 in Vietnamese

Response Fields:
- Array of exercise objects containing:
  - description: Exercise instruction in Vietnamese
  - sentence_en: Complete English sentence with answer
  - sentence_hide: Hidden version of the sentence with underscores

Exercise Features:
- Fill-in-the-blank format
- Hidden sentence with underscores
- Vietnamese instructions
- Progress tracking
- Score calculation
- Navigation between exercises
- Final score display
- Exercise restart capability 


=======


# A. API Profile user => 10 Weeks - 10 topics - 50 scenario!
# B. With Each 1 Topic 5 Scenario from Output A: Từ User Profile + Week-1Topic-5Scenario => 20 Chunking 
# B1. With Each Chunking from Output B1: User Profile + 1Week-1Topic-1Scenario-1Question => Detail Chunking 
# C. Từ each Detail Chunking of Output B2 => gen 4 Learning Meaning Exercise API
1, 2, 3, 4 exercises. 

# B2. Generate Learning Onion API

http://103.253.20.13:3000/api/generate-learning-onion

cURL Example:
```bash
curl -X POST \
  http://103.253.20.13:3000/api/generate-learning-onion \
  -H 'Content-Type: application/json' \
  -d '{
    "inputForOnion": "USER PROFILE:\n- Industry: [IT]\n- Job: [CTO]\n- Gender: Male\n- Native language: Vietnamese\n- English Level: [A2]\n- Learning goals: [workplace communication] [job interviews] [salary review]\n\nTOPIC: Project Updates\nSCENARIO: Weekly Project Status Meeting\nQUESTIONS:\n1. What progress has been made since last week?\n2. Are there any tasks that are behind schedule?\n3. What successes can you share from this week'\''s work?\n4. How do you plan to address any delays in the project?"
}'
```

Input:
```json
{
    "inputForOnion": "USER PROFILE:\n- Industry: [IT]\n- Job: [CTO]\n- Gender: Male\n- Native language: Vietnamese\n- English Level: [A2]\n- Learning goals: [workplace communication] [job interviews] [salary review]\n\nTOPIC: Project Updates\nSCENARIO: Weekly Project Status Meeting\nQUESTIONS:\n1. What progress has been made since last week?\n2. Are there any tasks that are behind schedule?\n3. What successes can you share from this week's work?\n4. How do you plan to address any delays in the project?"
}
```

Response:
```json
{
    "lesson_details": {
        "title": "Báo cáo tiến độ dự án hàng tuần",
        "context": "Bạn là CTO của một công ty IT, đang tham gia cuộc họp báo cáo tiến độ dự án hàng tuần với nhóm phát triển.",
        "character": "John Smith - Project Manager, phong cách giao tiếp chuyên nghiệp và thân thiện",
        "tasks": [
            "Báo cáo tiến độ công việc",
            "Đánh giá các vấn đề phát sinh",
            "Chia sẻ thành công",
            "Đề xuất giải pháp cho các vấn đề"
        ]
    },
    "system_prompt": "ROLE: you are a intelligent AI system specializing in generating life-like dialogue for English speech practice 1-on-1 roleplay. Roleplay with the following information:\n- User profile: [CTO, A2]\n- Context for user: Bạn là CTO của một công ty IT, đang tham gia cuộc họp báo cáo tiến độ dự án hàng tuần với nhóm phát triển.\n- AI's role: John Smith - Project Manager, phong cách giao tiếp chuyên nghiệp và thân thiện\n- Tasks: Báo cáo tiến độ công việc, Đánh giá các vấn đề phát sinh, Chia sẻ thành công, Đề xuất giải pháp cho các vấn đề\n- Question list: [What progress has been made since last week?, Are there any tasks that are behind schedule?, What successes can you share from this week's work?, How do you plan to address any delays in the project?]",
    "first_message": "Good morning! I hope you're doing well. Let's start our weekly project status meeting. Could you please give me a brief overview of what your team has accomplished since our last meeting?"
}
```

Required Input Parameters:
- inputForOnion: String containing:
  - User profile information
  - Topic
  - Scenario
  - List of questions

Response Fields:
- lesson_details: Object containing:
  - title: Lesson title in Vietnamese
  - context: Context description in Vietnamese
  - character: Character description in Vietnamese
  - tasks: Array of learning objectives
- system_prompt: Complete system prompt for AI roleplay
- first_message: Initial message to start the conversation

Features:
- Roleplay-based learning
- Contextual conversation practice
- Structured learning objectives
- Natural conversation flow
- Progressive difficulty
- Real-world scenario simulation 