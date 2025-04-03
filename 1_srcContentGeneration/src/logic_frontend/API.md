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
    "learningPath": "{\n  \"user_profile_description\": \"Vietnamese CTO in IT, A2 English\",\n  \"communication_partners\": [\n    {\n      \"group\": \"Developers\",\n      \"scenarios\": [\n        \"Project updates\",\n        \"Technical guidance\",\n        \"Code reviews\",\n        \"Problem-solving sessions\",\n        \"Team motivation\"\n      ]\n    },\n    {\n      \"group\": \"Executives\",\n      \"scenarios\": [\n        \"Strategic planning\",\n        \"Budget discussions\",\n        \"Performance reviews\",\n        \"Vision presentations\",\n        \"Partnership negotiations\"\n      ]\n    },\n    {\n      \"group\": \"Clients\",\n      \"scenarios\": [\n        \"Project proposals\",\n        \"Requirement gathering\",\n        \"Progress reports\",\n        \"Feedback sessions\",\n        \"Contract negotiations\"\n      ]\n    },\n    {\n      \"group\": \"HR\",\n      \"scenarios\": [\n        \"Job interviews\",\n        \"Salary reviews\",\n        \"Policy discussions\",\n        \"Conflict resolution\",\n        \"Training sessions\"\n      ]\n    },\n    {\n      \"group\": \"Vendors\",\n      \"scenarios\": [\n        \"Service agreements\",\n        \"Product evaluations\",\n        \"Pricing negotiations\",\n        \"Delivery timelines\",\n        \"Support queries\"\n      ]\n    }\n  ],\n  \"learning_path\": [\n    {\n      \"week\": 1,\n      \"topic\": \"Project updates | Cập nhật dự án\",\n      \"scenarios\": [\n        { \"scenario\": \"Cập nhật tiến độ dự án\" },\n        { \"scenario\": \"Thảo luận vấn đề kỹ thuật\" },\n        { \"scenario\": \"Đề xuất giải pháp mới\" },\n        { \"scenario\": \"Phân công nhiệm vụ\" },\n        { \"scenario\": \"Đánh giá kết quả công việc\" }\n      ]\n    },\n    {\n      \"week\": 2,\n      \"topic\": \"Technical guidance | Hướng dẫn kỹ thuật\",\n      \"scenarios\": [\n        { \"scenario\": \"Giải thích khái niệm phức tạp\" },\n        { \"scenario\": \"Hướng dẫn sử dụng công cụ\" },\n        { \"scenario\": \"Đưa ra lời khuyên kỹ thuật\" },\n        { \"scenario\": \"Phân tích lỗi hệ thống\" },\n        { \"scenario\": \"Đề xuất cải tiến quy trình\" }\n      ]\n    },\n    {\n      \"week\": 3,\n      \"topic\": \"Strategic planning | Lập kế hoạch chiến lược\",\n      \"scenarios\": [\n        { \"scenario\": \"Xác định mục tiêu dài hạn\" },\n        { \"scenario\": \"Phân tích thị trường\" },\n        { \"scenario\": \"Đánh giá rủi ro\" },\n        { \"scenario\": \"Lập kế hoạch hành động\" },\n        { \"scenario\": \"Thảo luận chiến lược phát triển\" }\n      ]\n    },\n    {\n      \"week\": 4,\n      \"topic\": \"Budget discussions | Thảo luận ngân sách\",\n      \"scenarios\": [\n        { \"scenario\": \"Trình bày ngân sách dự kiến\" },\n        { \"scenario\": \"Thảo luận chi phí phát sinh\" },\n        { \"scenario\": \"Đề xuất cắt giảm chi phí\" },\n        { \"scenario\": \"Phân bổ nguồn lực tài chính\" },\n        { \"scenario\": \"Đánh giá hiệu quả đầu tư\" }\n      ]\n    },\n    {\n      \"week\": 5,\n      \"topic\": \"Job interviews | Phỏng vấn xin việc\",\n      \"scenarios\": [\n        { \"scenario\": \"Giới thiệu bản thân\" },\n        { \"scenario\": \"Trình bày kinh nghiệm làm việc\" },\n        { \"scenario\": \"Thảo luận kỹ năng chuyên môn\" },\n        { \"scenario\": \"Đặt câu hỏi cho ứng viên\" },\n        { \"scenario\": \"Đánh giá ứng viên\" }\n      ]\n    },\n    {\n      \"week\": 6,\n      \"topic\": \"Salary reviews | Đánh giá lương\",\n      \"scenarios\": [\n        { \"scenario\": \"Trình bày thành tích cá nhân\" },\n        { \"scenario\": \"Thảo luận mức lương hiện tại\" },\n        { \"scenario\": \"Đề xuất tăng lương\" },\n        { \"scenario\": \"Thương lượng phúc lợi\" },\n        { \"scenario\": \"Đánh giá thị trường lao động\" }\n      ]\n    },\n    {\n      \"week\": 7,\n      \"topic\": \"Project proposals | Đề xuất dự án\",\n      \"scenarios\": [\n        { \"scenario\": \"Trình bày ý tưởng dự án\" },\n        { \"scenario\": \"Thảo luận lợi ích dự án\" },\n        { \"scenario\": \"Phân tích chi phí dự án\" },\n        { \"scenario\": \"Đề xuất kế hoạch thực hiện\" },\n        { \"scenario\": \"Đánh giá khả năng thành công\" }\n      ]\n    },\n    {\n      \"week\": 8,\n      \"topic\": \"Feedback sessions | Phiên phản hồi\",\n      \"scenarios\": [\n        { \"scenario\": \"Nhận phản hồi từ khách hàng\" },\n        { \"scenario\": \"Thảo luận cải tiến sản phẩm\" },\n        { \"scenario\": \"Đánh giá phản hồi tiêu cực\" },\n        { \"scenario\": \"Đề xuất giải pháp cải thiện\" },\n        { \"scenario\": \"Theo dõi tiến độ cải tiến\" }\n      ]\n    },\n    {\n      \"week\": 9,\n      \"topic\": \"Service agreements | Thỏa thuận dịch vụ\",\n      \"scenarios\": [\n        { \"scenario\": \"Trình bày điều khoản dịch vụ\" },\n        { \"scenario\": \"Thảo luận yêu cầu khách hàng\" },\n        { \"scenario\": \"Đàm phán điều khoản hợp đồng\" },\n        { \"scenario\": \"Đánh giá khả năng cung cấp\" },\n        { \"scenario\": \"Ký kết hợp đồng dịch vụ\" }\n      ]\n    },\n    {\n      \"week\": 10,\n      \"topic\": \"Product evaluations | Đánh giá sản phẩm\",\n      \"scenarios\": [\n        { \"scenario\": \"Trình bày tính năng sản phẩm\" },\n        { \"scenario\": \"Thảo luận ưu nhược điểm\" },\n        { \"scenario\": \"Đánh giá phản hồi người dùng\" },\n        { \"scenario\": \"Đề xuất cải tiến sản phẩm\" },\n        { \"scenario\": \"Phân tích đối thủ cạnh tranh\" }\n      ]\n    }\n  ],\n  \"milestones\": [\n    {\n      \"time\": \"2h\",\n      \"english_title\": \"Basic Project Updates\",\n      \"vn_detail\": \"Cập nhật dự án cơ bản\"\n    },\n    {\n      \"time\": \"10h\",\n      \"english_title\": \"Technical Guidance Mastery\",\n      \"vn_detail\": \"Thành thạo hướng dẫn kỹ thuật\"\n    },\n    {\n      \"time\": \"14h\",\n      \"english_title\": \"Strategic Planning Pro\",\n      \"vn_detail\": \"Chuyên gia lập kế hoạch chiến lược\"\n    },\n    {\n      \"time\": \"35h\",\n      \"english_title\": \"Interview and Salary Negotiator\",\n      \"vn_detail\": \"Đàm phán phỏng vấn và lương\"\n    },\n    {\n      \"time\": \"50h\",\n      \"english_title\": \"Client and Vendor Communicator\",\n      \"vn_detail\": \"Giao tiếp khách hàng và nhà cung cấp\"\n    }\n  ]\n}"
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

http://103.253.20.13:3000/api/generate-learning-flexible

Input:
```json
{"lessons":[{"question":"How do you say hello in English?","structure":"You say hello by ____.","main phrase":"saying hello","optional phrase 1":"waving your hand","optional phrase 2":"smiling at someone","question-vi":"Bạn nói hello bằng cách nào trong tiếng Anh?","structure-vi":"Bạn nói hello bằng cách ____.","main phrase-vi":"nói hello","optional phrase 1-vi":"vẫy tay","optional phrase 2-vi":"mỉm cười với ai đó","lesson_id":"hello_1257_03042025"}]}
```

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
# B1. With Each 1 Topic 5 Scenario from Output A: Từ User Profile + Week-1Topic-5Scenario => 20 Chunking 
# B2. With Each Chunking from Output B1: User Profile + 1Week-1Topic-1Scenario-1Question => Detail Chunking 
# B3. Từ each Detail Chunking of Output B2 => gen 4 Learning Meaning Exercise API
1, 2, 3, 4 exercises. 