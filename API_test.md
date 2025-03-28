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
  "chunkingPhrases": "{\n  \"topic\": \"Project updates\",\n  \"scenarios\": [\n    {\n      \"scenario\": \"Introducing the current project\",\n      \"questions\": [\n        \"Can you describe the main goal of the current project?\",\n        \"What technologies are we using in this project?\",\n        \"Who are the key team members involved in this project?\",\n        \"What is the expected timeline for this project?\"\n      ]\n    },\n    {\n      \"scenario\": \"Discussing work progress\",\n      \"questions\": [\n        \"How is the project progressing so far?\",\n        \"What tasks have been completed this week?\",\n        \"Are there any delays in the project timeline?\",\n        \"What challenges have you faced in your work?\"\n      ]\n    },\n    {\n      \"scenario\": \"Resolving emerging issues\",\n      \"questions\": [\n        \"What issues have come up recently in the project?\",\n        \"How do you plan to address these issues?\",\n        \"Have you discussed these problems with the team?\",\n        \"What support do you need to solve these issues?\"\n      ]\n    },\n    {\n      \"scenario\": \"Proposing project improvements\",\n      \"questions\": [\n        \"What improvements do you think we can make to the project?\",\n        \"How can we enhance team communication?\",\n        \"Are there any tools that could help us work better?\",\n        \"What feedback have you received from the team about the project?\"\n      ]\n    },\n    {\n      \"scenario\": \"Planning for next week\",\n      \"questions\": [\n        \"What are the main goals for next week?\",\n        \"Which tasks should we prioritize in the upcoming week?\",\n        \"How can we ensure we stay on track next week?\",\n        \"What resources do we need for next week's work?\"\n      ]\n    }\n  ]\n}"
}
```