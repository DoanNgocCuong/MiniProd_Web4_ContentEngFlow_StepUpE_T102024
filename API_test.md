# API Testing Documentation

## 1. Generate Learning Path
```bash
curl -X POST \
  http://localhost:3000/api/generate-learning-path \
  -H 'Content-Type: application/json' \
  -d '{
    "userProfile": "Industry: [IT]\nJob: [CTO]\nGender: Male\nNative language: Vietnamese\nEnglish Level: [A2]\nLearning goals: [workplace communication] [job interviews] [salary review]"
}'
```

## 2. Generate 20 Chunking Questions from 5 Scenarios
```bash
curl --location 'http://103.253.20.13:3000/api/generate-20-chunking-from-5-scenario' \
--header 'Content-Type: application/json' \
--data '{
  "userProfile5Scenario": "USER PROFILE:\n- Industry: IT\n- Job: CTO\n- Gender: Male\n- Native Language: Vietnamese\n- English Level: A2\n- Learning Goals: workplace communication, job interviews, salary review\n---\n{\n      \"week\": 1,\n      \"topic\": \"Project updates (Cập nhật dự án)\",\n      \"scenarios\": [\n        { \"scenario\": \"Giới thiệu dự án hiện tại\" },\n        { \"scenario\": \"Thảo luận tiến độ công việc\" },\n        { \"scenario\": \"Giải quyết vấn đề phát sinh\" },\n        { \"scenario\": \"Đề xuất cải tiến dự án\" },\n        { \"scenario\": \"Lên kế hoạch cho tuần tới\" }\n      ]\n    }"
}'
```

### Expected Response:
```json
{
  "learningPath": {
    "topic": "Project updates",
    "scenarios": [
      {
        "scenario": "Giới thiệu dự án hiện tại",
        "questions": [
          "Could you tell me about your current project?",
          "What are the main objectives of this project?",
          "How long have you been working on this project?",
          "What is your role in this project?"
        ]
      }
      // ... 4 more scenarios with 4 questions each
    ]
  }
}
```
```
