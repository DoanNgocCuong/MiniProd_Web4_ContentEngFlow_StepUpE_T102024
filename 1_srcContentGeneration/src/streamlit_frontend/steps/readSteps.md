# Learning Path Generation Steps

## ⚠️ CHÚ Ý QUAN TRỌNG
1. **Format User Profile:**
   - Industry, Job, English Level phải được đặt trong dấu ngoặc vuông `[]`
   - Ví dụ: `Industry: [IT]`, `Job: [CTO]`, `English Level: [A2]`
   - Learning goals có thể có nhiều mục, mỗi mục trong `[]`
   - Ví dụ: `Learning goals: [workplace communication] [job interviews] [salary review]`

2. **API Step B:**
   - Key trong request phải là `userProfile5Scenario` (không phải `payload`)
   - Format: `USER PROFILE:\n- Industry: [value]\n- Job: [value]\n- English Level: [value]\n- Learning Goals: [value]\n---\n{week_data}`
   - Phải có dấu gạch ngang `---` giữa user profile và week data

3. **Scenarios:**
   - Mỗi topic phải có đủ 5 scenarios
   - Mỗi scenario phải có format `{"scenario": "text"}`
   - Không được để trống scenario

4. **Error Handling:**
   - Kiểm tra đầy đủ thông tin trước khi gọi API
   - Xử lý lỗi 400 Bad Request nếu format không đúng
   - Xử lý lỗi JSON parsing nếu response không hợp lệ

## Step A: Generate Learning Path from User Profile
**API Endpoint:** `http://103.253.20.13:3000/api/generate-learning-path`

### Input Format
```json
{
    "userProfile": "Industry: [IT]\nJob: [CTO]\nGender: Male\nNative language: Vietnamese\nEnglish Level: [A2]\nLearning goals: [workplace communication] [job interviews] [salary review]"
}
```

### Output Format
```json
{
    "learningPath": {
        "user_profile_description": "Vietnamese CTO in IT, A2 English",
        "communication_partners": [
            {
                "group": "Developers",
                "scenarios": [
                    "Project updates",
                    "Technical guidance",
                    "Code reviews",
                    "Problem-solving sessions",
                    "Team motivation"
                ]
            }
        ],
        "learning_path": [
            {
                "week": 1,
                "topic": "Project updates | Cập nhật dự án",
                "scenarios": [
                    { "scenario": "Cập nhật tiến độ dự án" }
                ]
            }
        ],
        "milestones": [
            {
                "time": "2h",
                "english_title": "Basic Project Updates",
                "vn_detail": "Cập nhật dự án cơ bản"
            }
        ]
    }
}
```

## Step B: Generate Questions from Topic and Scenarios
**API Endpoint:** `http://103.253.20.13:3000/api/generate-20-chunking-from-5-scenario`

### Input Format
```json
{
    "userProfile5Scenario": "USER PROFILE:\n- Industry: [IT]\n- Job: [CTO]\n- English Level: [A2]\n- Learning Goals: [workplace communication]\n---\n{\n  \"week\": 1,\n  \"topic\": \"Project updates (Cập nhật dự án)\",\n  \"scenarios\": [\n    {\"scenario\": \"Giới thiệu dự án mới\"},\n    {\"scenario\": \"Báo cáo tiến độ hàng tuần\"},\n    {\"scenario\": \"Thảo luận vấn đề kỹ thuật\"},\n    {\"scenario\": \"Đề xuất giải pháp cải tiến\"},\n    {\"scenario\": \"Phản hồi từ nhóm phát triển\"}\n  ]\n}"
}
```

### Output Format
```json
{
    "chunkingPhrases": {
        "topic": "Project updates (Cập nhật dự án)",
        "scenarios": [
            {
                "scenario": "Giới thiệu dự án mới",
                "questions": [
                    "Can you describe the main goal of the new project?",
                    "What are the key features of this project?",
                    "Who are the main stakeholders involved in this project?",
                    "What challenges do you expect to face with this new project?"
                ]
            }
        ]
    }
}
```

## Step C: Generate Question Detail
**API Endpoint:** `http://103.253.20.13:3000/api/generate-questions`

### Input Format
```json
{
    "generateQuestionInput": "Generate 1 English question about Project updates in the context of Weekly status meeting for CTO in IT industry. The specific question is: Can you explain the main objective of the new project?"
}
```

### Output Format
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

## Step D: Generate Exercises
**Base API Endpoint:** `http://103.253.20.13:3000`

### Input Format
Uses the output from Step C as input:
```json
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
```

### 1. QNA Exercise
**Endpoint:** `/api/generate-learning-qna`
```json
{
    "lessons": [{
        "structure": "The main objective of the new project is ____.",
        "main phrase": "to improve efficiency",
        "optional phrase 1": "to increase revenue",
        "optional phrase 2": "to enhance customer satisfaction"
    }]
}
```

### 2. Meaning Exercise
**Endpoint:** `/api/generate-learning-meaning`
```json
{
    "lessons": [{
        "structure": "The main objective of the new project is ____.",
        "main phrase": "to improve efficiency",
        "optional phrase 1": "to increase revenue",
        "optional phrase 2": "to enhance customer satisfaction",
        "structure-vi": "Mục tiêu chính của dự án mới là ____.",
        "main phrase-vi": "cải thiện hiệu quả",
        "optional phrase 1-vi": "tăng doanh thu",
        "optional phrase 2-vi": "nâng cao sự hài lòng của khách hàng"
    }]
}
```

### 3. Flexible Exercise
**Endpoint:** `/api/generate-learning-flexible`
```json
{
    "lessons": [{
        "question": "Can you explain the main objective of the new project?",
        "structure": "The main objective of the new project is ____.",
        "phrases": [
            "to improve efficiency",
            "to increase revenue",
            "to enhance customer satisfaction"
        ]
    }]
}
```

### 4. Card Exercise
**Endpoint:** `/api/generate-learning-card`
```json
{
    "lessons": [{
        "structure": "The main objective of the new project is ____.",
        "main phrase": "to improve efficiency",
        "optional phrase 1": "to increase revenue",
        "optional phrase 2": "to enhance customer satisfaction",
        "structure-vi": "Mục tiêu chính của dự án mới là ____.",
        "main phrase-vi": "cải thiện hiệu quả",
        "optional phrase 1-vi": "tăng doanh thu",
        "optional phrase 2-vi": "nâng cao sự hài lòng của khách hàng"
    }]
}
```

### Exercise Types Description
1. **QNA Exercise:**
   - Focus on question and answer practice
   - Includes hidden sentences for practice
   - Shows English sentences with blanks

2. **Meaning Exercise:**
   - Focus on understanding meaning
   - Includes Vietnamese translations
   - Provides alternative answers with explanations

3. **Flexible Exercise:**
   - Adaptive exercise format
   - Multiple ways to practice the same content
   - Progressive difficulty levels

4. **Card Exercise:**
   - Flashcard-style learning
   - Includes IPA pronunciation
   - English and Vietnamese translations

## Flow Description
1. Step A: Generate learning path
2. Step B: Generate questions for each topic
3. Step C: Generate detailed content for each question
4. Step D: Generate four types of exercises for practice

## Notes
- All APIs require proper error handling
- Each exercise type serves a different learning purpose
- Exercises can be combined for comprehensive practice
- Vietnamese translations help with understanding
- IPA helps with pronunciation practice
