# Example data for all steps

# Step A: User Profile Example
user_profile_example = {
    "userProfile": "Industry: [IT]\nJob: [CTO]\nGender: Male\nNative language: Vietnamese\nEnglish Level: [A2]\nLearning goals: [workplace communication] [job interviews] [salary review]"
}

# Step A: Learning Path Example
learning_path_example = {
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
            },
            {
                "group": "Executives",
                "scenarios": [
                    "Strategic planning",
                    "Budget discussions",
                    "Performance reviews",
                    "Vision presentations",
                    "Partnership negotiations"
                ]
            }
        ],
        "learning_path": [
            {
                "week": 1,
                "topic": "Project updates | Cập nhật dự án",
                "scenarios": [
                    { "scenario": "Cập nhật tiến độ dự án" },
                    { "scenario": "Thảo luận vấn đề kỹ thuật" },
                    { "scenario": "Đề xuất giải pháp mới" },
                    { "scenario": "Phân công nhiệm vụ" },
                    { "scenario": "Đánh giá kết quả công việc" }
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

# Step B: Question Generation Example
question_generation_example = {
    "userProfile5Scenario": "USER PROFILE:\n- Industry: [IT]\n- Job: [CTO]\n- English Level: [A2]\n- Learning Goals: [workplace communication]\n---\n{\n  \"week\": 1,\n  \"topic\": \"Project updates (Cập nhật dự án)\",\n  \"scenarios\": [\n    {\"scenario\": \"Giới thiệu dự án mới\"},\n    {\"scenario\": \"Báo cáo tiến độ hàng tuần\"},\n    {\"scenario\": \"Thảo luận vấn đề kỹ thuật\"},\n    {\"scenario\": \"Đề xuất giải pháp cải tiến\"},\n    {\"scenario\": \"Phản hồi từ nhóm phát triển\"}\n  ]\n}"
}

# Step B: Questions Output Example
questions_output_example = {
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

# Step C: Question Detail Example
question_detail_example = {
    "generateQuestionInput": "Generate 1 English question about Project updates in the context of Weekly status meeting for CTO in IT industry. The specific question is: Can you explain the main objective of the new project?"
}

# Step C: Question Detail Output Example
question_detail_output_example = {
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

# Step D: Exercise Generation Examples
# 1. QNA Exercise Example
qna_exercise_example = {
    "lessons": [{
        "structure": "The main objective of the new project is ____.",
        "main phrase": "to improve efficiency",
        "optional phrase 1": "to increase revenue",
        "optional phrase 2": "to enhance customer satisfaction"
    }]
}

# 2. Meaning Exercise Example
meaning_exercise_example = {
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

# 3. Flexible Exercise Example
flexible_exercise_example = {
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

# 4. Card Exercise Example
card_exercise_example = {
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

# Default example data for the exercise generator
example_data = question_detail_output_example