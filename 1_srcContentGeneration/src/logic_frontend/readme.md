# **Process Flow**:
   ```bash
   User Profile
      ↓
   Step A: Generate Learning Path
      ↓
   For each week:
      ↓
   Step B1: Generate 20 Chunking Questions
      ↓
   For each scenario:
      ↓
   Step B2: Generate Detail Chunking
      ↓
   Step B3: Generate 4 Types of Exercises
      ↓
   Save to Excel Files
      ↓
   Create Summary File
   ```
---

Luồng xử lý được chia thành 4 bước chính:

### Step A: Tạo Learning Path
- Gọi API `/api/generate-learning-path`
- Nhận về 10 tuần học với các chủ đề và kịch bản
- Lưu vào file Excel `learning_path_[timestamp].xlsx`

### Step B1: Tạo 20 Chunking Questions
- Với mỗi tuần trong learning path:
  - Gọi API `/api/generate-20-chunking-from-5-scenario`
  - Tạo 20 câu hỏi từ 5 kịch bản
  - Lưu vào file Excel `chunking_week_X_[timestamp].xlsx`

### Step B2: Tạo Detail Chunking
- Với mỗi question được tạo trong 20 question:
  - Gọi API `/api/generate-questions`
  - Tạo chi tiết cho từng câu hỏi
  - Lưu vào file Excel `detail_week_X_scenario_Y_[timestamp].xlsx`

### Step B3: Tạo 4 Loại Bài Tập
- Với mỗi detail chunking:
  - Gọi 4 API khác nhau:
    1. `/api/generate-learning-meaning`: Bài tập về nghĩa
    2. `/api/generate-learning-card`: Bài tập thẻ
    3. `/api/generate-learning-flexible`: Bài tập linh hoạt
    4. `/api/generate-learning-qna`: Bài tập hỏi đáp
  - Lưu vào file Excel `exercises_week_X_scenario_Y_[timestamp].xlsx`





---
To use this code:

1. Create a user profile:
```python
user_profile = UserProfile(
    industry="IT",
    job="CTO",
    gender="Male",
    native_language="Vietnamese",
    english_level="A2",
    learning_goals=["workplace communication", "job interviews", "salary review"]
)
```

2. Initialize and run the flow:
```python
flow = ContentGenerationFlow()
flow.process_user_profile(user_profile)
```

The code will:
1. Generate separate Excel files for each step
2. Save them in the `output` directory
3. Create a summary file combining all sheets

Would you like me to add any additional features or make any modifications to this implementation?
