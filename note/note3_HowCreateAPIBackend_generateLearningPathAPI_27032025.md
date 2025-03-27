# Quá Trình Tạo API Generate Learning Path

## 1. Tạo Controller File
File: `src/backend/src/controllers/generateLearningPathController.js`

### 1.1. Setup Ban Đầu
```javascript
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
```

### 1.2. Tạo Prompt Template
```javascript
const generateLearningPathPrompt = `
You are ESP learning path expert...
// Chi tiết prompt template
`;
```

Prompt template được thiết kế để:
- Mô tả user profile
- Liệt kê nhóm người giao tiếp
- Tạo 10 chủ đề học tập
- Tạo các milestone
- Output theo format JSON chuẩn

### 1.3. Tạo Controller Function
```javascript
exports.generateLearningPath = async (req, res) => {
    try {
        const { userProfile } = req.body;
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-2024-08-06',
            messages: [
                { role: 'system', content: generateLearningPathPrompt },
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
```

## 2. Cập Nhật Routes
File: `src/backend/src/routes/index.js`

### 2.1. Import Controller
```javascript
const generateLearningPathController = require('../controllers/generateLearningPathController');
```

### 2.2. Thêm Route
```javascript
router.post('/generate-learning-path', generateLearningPathController.generateLearningPath);
```

## 3. Cấu Trúc API

### 3.1. Request
- Method: POST
- Endpoint: `/generate-learning-path`
- Body:
```json
{
    "userProfile": "Industry: [IT]\nJob: [CTO]\nEnglish Level: [A2]\nLearning goals: [workplace communication] [job interviews] [salary review]"
}
```

### 3.2. Response
```json
{
    "learningPath": {
        "user_profile_description": "...",
        "communication_partners": [...],
        "learning_path": [...],
        "milestones": [...]
    }
}
```

## 4. Các Thay Đổi Chính

1. **Controller**:
   - Tạo mới file controller
   - Thiết kế prompt template chi tiết
   - Xử lý request và response

2. **Routes**:
   - Import controller mới
   - Thêm route mới cho learning path
   - Giữ nguyên cấu trúc routes hiện tại

## 5. Testing
```bash
curl -X POST \
  http://localhost:3000/api/generate-learning-path \
  -H 'Content-Type: application/json' \
  -d '{
    "userProfile": "Industry: [IT]\nJob: [CTO]\nGender: Male\nNative language: Vietnamese\nEnglish Level: [A2]\nLearning goals: [workplace communication] [job interviews] [salary review]"
}'
```

## 6. Lưu ý
- API sử dụng GPT-4 để tạo learning path
- Response được format theo JSON template chuẩn
- Có xử lý lỗi và trả về error message phù hợp