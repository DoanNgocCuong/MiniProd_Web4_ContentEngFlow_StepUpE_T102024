# Suũa chua quan 
```bash
        const content = response.choices[0].message.content;
  
        res.json({ learningPath: content });
```

```bash
        const content = response.choices[0].message.content;

        const parsedContent = JSON.parse(content);

        res.json(parsedContent);
```


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
    "learningPath": "```json\n{\n  \"user_profile_description\": \"Vietnamese male CTO in IT industry with A2 English level aiming to improve workplace communication, job interview skills, and salary review discussions.\",\n \"vn_detail\": \"Thành thạo giao tiếp trong mọi tình huống công việc, từ thuyết trình đến giải quyết xung đột.\"\n    }\n  ]\n}\n```"
}
```

Update thanh 
```bash
{
    "user_profile_description": "Vietnamese male CTO in IT industry with A2 English level aiming to improve workplace communication, job interview skills, and salary review discussions.",
    "discussion_topics": [
        {
            "Learning goal": "workplace communication",
            "Topics": [
                "Team meeting participation",
                "Project updates",
                "Technical problem-solving",
                "Feedback exchange",
                "Cross-department collaboration",
                "Client communication",
                "Negotiating project timelines",
                "Explaining technical concepts",
                "Conflict resolution",
                "Delegating tasks"
            ]
        },
        {
            "Learning goal": "job interviews",
            "Topics": [
                "Discussing career achievements",
                "Explaining technical skills",
                "Answering behavioral questions",
                "Discussing leadership experience",
                "Explaining project management",
                "Discussing industry trends",
                "Handling unexpected questions",
                "Discussing company culture fit",
                "Explaining career goals",
                "Discussing salary expectations"
            ]
        },
        {
            "Learning goal": "salary review",
            "Topics": [
                "Presenting achievements",
                "Discussing market salary trends",
                "Negotiating salary increase",
                "Explaining added responsibilities",
                "Discussing performance metrics",
                "Handling objections",
                "Explaining personal development",
                "Discussing company budget constraints",
                "Presenting future goals",
                "Discussing benefits package"
            ]
        }
    ],
    "learning_path": [
        {
            "week": 1,
            "topic": "Team meeting participation | [workplace communication]",
            "scenarios": [
                {
                    "scenario": "Thảo luận về tiến độ dự án",
                    "thumbnail": "https://your-image-service.com/images/Th%E1%BA%A3o%20lu%E1%BA%ADn%20v%E1%BB%81%20ti%E1%BA%BFn%20%C4%91%E1%BB%99%20d%E1%BB%B1%20%C3%A1n"
                },
                {
                    "scenario": "Đề xuất ý tưởng mới",
                    "thumbnail": "https://your-image-service.com/images/%C4%90%E1%BB%81%20xu%E1%BA%A5t%20%C3%BD%20t%C6%B0%E1%BB%9Fng%20m%E1%BB%9Bi"
                },
                {
                    "scenario": "Giải thích vấn đề kỹ thuật",
                    "thumbnail": "https://your-image-service.com/images/Gi%E1%BA%A3i%20th%C3%ADch%20v%E1%BA%A5n%20%C4%91%E1%BB%81%20k%E1%BB%B9%20thu%E1%BA%ADt"
                },
                {
                    "scenario": "Phân tích phản hồi từ đồng nghiệp",
                    "thumbnail": "https://your-image-service.com/images/Ph%C3%A2n%20t%C3%ADch%20ph%E1%BA%A3n%20h%E1%BB%93i%20t%E1%BB%AB%20%C4%91%E1%BB%93ng%20nghi%E1%BB%87p"
                },
                {
                    "scenario": "Đưa ra quyết định nhóm",
                    "thumbnail": "https://your-image-service.com/images/%C4%90%C6%B0a%20ra%20quy%E1%BA%BFt%20%C4%91%E1%BB%8Bnh%20nh%C3%B3m"
                }
            ]
        },
        {
            "week": 2,
            "topic": "Explaining technical skills | [job interviews]",
            "scenarios": [
                {
                    "scenario": "Mô tả kỹ năng lập trình",
                    "thumbnail": "https://your-image-service.com/images/M%C3%B4%20t%E1%BA%A3%20k%E1%BB%B9%20n%C4%83ng%20l%E1%BA%ADp%20tr%C3%ACnh"
                },
                {
                    "scenario": "Giải thích kinh nghiệm quản lý dự án",
                    "thumbnail": "https://your-image-service.com/images/Gi%E1%BA%A3i%20th%C3%ADch%20kinh%20nghi%E1%BB%87m%20qu%E1%BA%A3n%20l%C3%BD%20d%E1%BB%B1%20%C3%A1n"
                },
                {
                    "scenario": "So sánh công nghệ đã sử dụng",
                    "thumbnail": "https://your-image-service.com/images/So%20s%C3%A1nh%20c%C3%B4ng%20ngh%E1%BB%87%20%C4%91%C3%A3%20s%E1%BB%AD%20d%E1%BB%A5ng"
                },
                {
                    "scenario": "Đánh giá công cụ phát triển phần mềm",
                    "thumbnail": "https://your-image-service.com/images/%C4%90%C3%A1nh%20gi%C3%A1%20c%C3%B4ng%20c%E1%BB%A5%20ph%C3%A1t%20tri%E1%BB%83n%20ph%E1%BA%A7n%20m%E1%BB%81m"
                },
                {
                    "scenario": "Trình bày về một dự án thành công",
                    "thumbnail": "https://your-image-service.com/images/Tr%C3%ACnh%20b%C3%A0y%20v%E1%BB%81%20m%E1%BB%99t%20d%E1%BB%B1%20%C3%A1n%20th%C3%A0nh%20c%C3%B4ng"
                }
            ]
        },
        {
            "week": 3,
            "topic": "Project updates | [workplace communication]",
            "scenarios": [
                {
                    "scenario": "Cập nhật tiến độ dự án",
                    "thumbnail": "https://your-image-service.com/images/C%E1%BA%ADp%20nh%E1%BA%ADt%20ti%E1%BA%BFn%20%C4%91%E1%BB%99%20d%E1%BB%B1%20%C3%A1n"
                },
                {
                    "scenario": "Báo cáo về vấn đề phát sinh",
                    "thumbnail": "https://your-image-service.com/images/B%C3%A1o%20c%C3%A1o%20v%E1%BB%81%20v%E1%BA%A5n%20%C4%91%E1%BB%81%20ph%C3%A1t%20sinh"
                },
                {
                    "scenario": "Đề xuất giải pháp cho vấn đề",
                    "thumbnail": "https://your-image-service.com/images/%C4%90%E1%BB%81%20xu%E1%BA%A5t%20gi%E1%BA%A3i%20ph%C3%A1p%20cho%20v%E1%BA%A5n%20%C4%91%E1%BB%81"
                },
                {
                    "scenario": "Thảo luận về thay đổi kế hoạch",
                    "thumbnail": "https://your-image-service.com/images/Th%E1%BA%A3o%20lu%E1%BA%ADn%20v%E1%BB%81%20thay%20%C4%91%E1%BB%95i%20k%E1%BA%BF%20ho%E1%BA%A1ch"
                },
                {
                    "scenario": "Đánh giá kết quả dự án",
                    "thumbnail": "https://your-image-service.com/images/%C4%90%C3%A1nh%20gi%C3%A1%20k%E1%BA%BFt%20qu%E1%BA%A3%20d%E1%BB%B1%20%C3%A1n"
                }
            ]
        },
        {
            "week": 4,
            "topic": "Discussing career achievements | [job interviews]",
            "scenarios": [
                {
                    "scenario": "Trình bày thành tựu nổi bật",
                    "thumbnail": "https://your-image-service.com/images/Tr%C3%ACnh%20b%C3%A0y%20th%C3%A0nh%20t%E1%BB%B1u%20n%E1%BB%95i%20b%E1%BA%ADt"
                },
                {
                    "scenario": "Giải thích vai trò trong dự án lớn",
                    "thumbnail": "https://your-image-service.com/images/Gi%E1%BA%A3i%20th%C3%ADch%20vai%20tr%C3%B2%20trong%20d%E1%BB%B1%20%C3%A1n%20l%E1%BB%9Bn"
                },
                {
                    "scenario": "So sánh thành tựu với mục tiêu",
                    "thumbnail": "https://your-image-service.com/images/So%20s%C3%A1nh%20th%C3%A0nh%20t%E1%BB%B1u%20v%E1%BB%9Bi%20m%E1%BB%A5c%20ti%C3%AAu"
                },
                {
                    "scenario": "Đánh giá sự phát triển cá nhân",
                    "thumbnail": "https://your-image-service.com/images/%C4%90%C3%A1nh%20gi%C3%A1%20s%E1%BB%B1%20ph%C3%A1t%20tri%E1%BB%83n%20c%C3%A1%20nh%C3%A2n"
                },
                {
                    "scenario": "Chia sẻ bài học từ thất bại",
                    "thumbnail": "https://your-image-service.com/images/Chia%20s%E1%BA%BB%20b%C3%A0i%20h%E1%BB%8Dc%20t%E1%BB%AB%20th%E1%BA%A5t%20b%E1%BA%A1i"
                }
            ]
        },
        {
            "week": 5,
            "topic": "Negotiating salary increase | [salary review]",
            "scenarios": [
                {
                    "scenario": "Đề xuất mức lương mong muốn",
                    "thumbnail": "https://your-image-service.com/images/%C4%90%E1%BB%81%20xu%E1%BA%A5t%20m%E1%BB%A9c%20l%C6%B0%C6%A1ng%20mong%20mu%E1%BB%91n"
                },
                {
                    "scenario": "Giải thích lý do tăng lương",
                    "thumbnail": "https://your-image-service.com/images/Gi%E1%BA%A3i%20th%C3%ADch%20l%C3%BD%20do%20t%C4%83ng%20l%C6%B0%C6%A1ng"
                },
                {
                    "scenario": "Thương lượng với quản lý",
                    "thumbnail": "https://your-image-service.com/images/Th%C6%B0%C6%A1ng%20l%C6%B0%E1%BB%A3ng%20v%E1%BB%9Bi%20qu%E1%BA%A3n%20l%C3%BD"
                },
                {
                    "scenario": "Đưa ra ví dụ về đóng góp",
                    "thumbnail": "https://your-image-service.com/images/%C4%90%C6%B0a%20ra%20v%C3%AD%20d%E1%BB%A5%20v%E1%BB%81%20%C4%91%C3%B3ng%20g%C3%B3p"
                },
                {
                    "scenario": "Phân tích mức lương thị trường",
                    "thumbnail": "https://your-image-service.com/images/Ph%C3%A2n%20t%C3%ADch%20m%E1%BB%A9c%20l%C6%B0%C6%A1ng%20th%E1%BB%8B%20tr%C6%B0%E1%BB%9Dng"
                }
            ]
        },
        {
            "week": 6,
            "topic": "Feedback exchange | [workplace communication]",
            "scenarios": [
                {
                    "scenario": "Đưa ra phản hồi cho đồng nghiệp",
                    "thumbnail": "https://your-image-service.com/images/%C4%90%C6%B0a%20ra%20ph%E1%BA%A3n%20h%E1%BB%93i%20cho%20%C4%91%E1%BB%93ng%20nghi%E1%BB%87p"
                },
                {
                    "scenario": "Nhận phản hồi từ quản lý",
                    "thumbnail": "https://your-image-service.com/images/Nh%E1%BA%ADn%20ph%E1%BA%A3n%20h%E1%BB%93i%20t%E1%BB%AB%20qu%E1%BA%A3n%20l%C3%BD"
                },
                {
                    "scenario": "Thảo luận về cải tiến công việc",
                    "thumbnail": "https://your-image-service.com/images/Th%E1%BA%A3o%20lu%E1%BA%ADn%20v%E1%BB%81%20c%E1%BA%A3i%20ti%E1%BA%BFn%20c%C3%B4ng%20vi%E1%BB%87c"
                },
                {
                    "scenario": "Phân tích phản hồi tiêu cực",
                    "thumbnail": "https://your-image-service.com/images/Ph%C3%A2n%20t%C3%ADch%20ph%E1%BA%A3n%20h%E1%BB%93i%20ti%C3%AAu%20c%E1%BB%B1c"
                },
                {
                    "scenario": "Đề xuất cách cải thiện",
                    "thumbnail": "https://your-image-service.com/images/%C4%90%E1%BB%81%20xu%E1%BA%A5t%20c%C3%A1ch%20c%E1%BA%A3i%20thi%E1%BB%87n"
                }
            ]
        },
        {
            "week": 7,
            "topic": "Discussing salary expectations | [job interviews]",
            "scenarios": [
                {
                    "scenario": "Trình bày kỳ vọng lương",
                    "thumbnail": "https://your-image-service.com/images/Tr%C3%ACnh%20b%C3%A0y%20k%E1%BB%B3%20v%E1%BB%8Dng%20l%C6%B0%C6%A1ng"
                },
                {
                    "scenario": "Giải thích lý do cho mức lương",
                    "thumbnail": "https://your-image-service.com/images/Gi%E1%BA%A3i%20th%C3%ADch%20l%C3%BD%20do%20cho%20m%E1%BB%A9c%20l%C6%B0%C6%A1ng"
                },
                {
                    "scenario": "Thương lượng mức lương khởi điểm",
                    "thumbnail": "https://your-image-service.com/images/Th%C6%B0%C6%A1ng%20l%C6%B0%E1%BB%A3ng%20m%E1%BB%A9c%20l%C6%B0%C6%A1ng%20kh%E1%BB%9Fi%20%C4%91i%E1%BB%83m"
                },
                {
                    "scenario": "So sánh với mức lương thị trường",
                    "thumbnail": "https://your-image-service.com/images/So%20s%C3%A1nh%20v%E1%BB%9Bi%20m%E1%BB%A9c%20l%C6%B0%C6%A1ng%20th%E1%BB%8B%20tr%C6%B0%E1%BB%9Dng"
                },
                {
                    "scenario": "Đưa ra lý do cho sự linh hoạt",
                    "thumbnail": "https://your-image-service.com/images/%C4%90%C6%B0a%20ra%20l%C3%BD%20do%20cho%20s%E1%BB%B1%20linh%20ho%E1%BA%A1t"
                }
            ]
        },
        {
            "week": 8,
            "topic": "Client communication | [workplace communication]",
            "scenarios": [
                {
                    "scenario": "Giải thích sản phẩm cho khách hàng",
                    "thumbnail": "https://your-image-service.com/images/Gi%E1%BA%A3i%20th%C3%ADch%20s%E1%BA%A3n%20ph%E1%BA%A9m%20cho%20kh%C3%A1ch%20h%C3%A0ng"
                },
                {
                    "scenario": "Thảo luận yêu cầu dự án",
                    "thumbnail": "https://your-image-service.com/images/Th%E1%BA%A3o%20lu%E1%BA%ADn%20y%C3%AAu%20c%E1%BA%A7u%20d%E1%BB%B1%20%C3%A1n"
                },
                {
                    "scenario": "Đề xuất giải pháp cho khách hàng",
                    "thumbnail": "https://your-image-service.com/images/%C4%90%E1%BB%81%20xu%E1%BA%A5t%20gi%E1%BA%A3i%20ph%C3%A1p%20cho%20kh%C3%A1ch%20h%C3%A0ng"
                },
                {
                    "scenario": "Phân tích phản hồi từ khách hàng",
                    "thumbnail": "https://your-image-service.com/images/Ph%C3%A2n%20t%C3%ADch%20ph%E1%BA%A3n%20h%E1%BB%93i%20t%E1%BB%AB%20kh%C3%A1ch%20h%C3%A0ng"
                },
                {
                    "scenario": "Thương lượng điều khoản hợp đồng",
                    "thumbnail": "https://your-image-service.com/images/Th%C6%B0%C6%A1ng%20l%C6%B0%E1%BB%A3ng%20%C4%91i%E1%BB%81u%20kho%E1%BA%A3n%20h%E1%BB%A3p%20%C4%91%E1%BB%93ng"
                }
            ]
        },
        {
            "week": 9,
            "topic": "Discussing market salary trends | [salary review]",
            "scenarios": [
                {
                    "scenario": "Phân tích xu hướng lương ngành",
                    "thumbnail": "https://your-image-service.com/images/Ph%C3%A2n%20t%C3%ADch%20xu%20h%C6%B0%E1%BB%9Bng%20l%C6%B0%C6%A1ng%20ng%C3%A0nh"
                },
                {
                    "scenario": "So sánh mức lương với đối thủ",
                    "thumbnail": "https://your-image-service.com/images/So%20s%C3%A1nh%20m%E1%BB%A9c%20l%C6%B0%C6%A1ng%20v%E1%BB%9Bi%20%C4%91%E1%BB%91i%20th%E1%BB%A7"
                },
                {
                    "scenario": "Đưa ra dự báo lương tương lai",
                    "thumbnail": "https://your-image-service.com/images/%C4%90%C6%B0a%20ra%20d%E1%BB%B1%20b%C3%A1o%20l%C6%B0%C6%A1ng%20t%C6%B0%C6%A1ng%20lai"
                },
                {
                    "scenario": "Thảo luận về ảnh hưởng kinh tế",
                    "thumbnail": "https://your-image-service.com/images/Th%E1%BA%A3o%20lu%E1%BA%ADn%20v%E1%BB%81%20%E1%BA%A3nh%20h%C6%B0%E1%BB%9Fng%20kinh%20t%E1%BA%BF"
                },
                {
                    "scenario": "Giải thích sự khác biệt lương",
                    "thumbnail": "https://your-image-service.com/images/Gi%E1%BA%A3i%20th%C3%ADch%20s%E1%BB%B1%20kh%C3%A1c%20bi%E1%BB%87t%20l%C6%B0%C6%A1ng"
                }
            ]
        },
        {
            "week": 10,
            "topic": "Cross-department collaboration | [workplace communication]",
            "scenarios": [
                {
                    "scenario": "Thảo luận dự án liên phòng ban",
                    "thumbnail": "https://your-image-service.com/images/Th%E1%BA%A3o%20lu%E1%BA%ADn%20d%E1%BB%B1%20%C3%A1n%20li%C3%AAn%20ph%C3%B2ng%20ban"
                },
                {
                    "scenario": "Giải thích vai trò của từng phòng ban",
                    "thumbnail": "https://your-image-service.com/images/Gi%E1%BA%A3i%20th%C3%ADch%20vai%20tr%C3%B2%20c%E1%BB%A7a%20t%E1%BB%ABng%20ph%C3%B2ng%20ban"
                },
                {
                    "scenario": "Đề xuất cách phối hợp hiệu quả",
                    "thumbnail": "https://your-image-service.com/images/%C4%90%E1%BB%81%20xu%E1%BA%A5t%20c%C3%A1ch%20ph%E1%BB%91i%20h%E1%BB%A3p%20hi%E1%BB%87u%20qu%E1%BA%A3"
                },
                {
                    "scenario": "Phân tích kết quả hợp tác",
                    "thumbnail": "https://your-image-service.com/images/Ph%C3%A2n%20t%C3%ADch%20k%E1%BA%BFt%20qu%E1%BA%A3%20h%E1%BB%A3p%20t%C3%A1c"
                },
                {
                    "scenario": "Đánh giá hiệu quả làm việc nhóm",
                    "thumbnail": "https://your-image-service.com/images/%C4%90%C3%A1nh%20gi%C3%A1%20hi%E1%BB%87u%20qu%E1%BA%A3%20l%C3%A0m%20vi%E1%BB%87c%20nh%C3%B3m"
                }
            ]
        }
    ],
    "milestones": [
        {
            "time": "2h",
            "english_title": "Basic Communicator",
            "vn_detail": "Có thể tham gia vào các cuộc họp nhóm cơ bản và thảo luận về tiến độ dự án."
        },
        {
            "time": "10h",
            "english_title": "Interview Ready",
            "vn_detail": "Có khả năng giải thích kỹ năng kỹ thuật và thảo luận về thành tựu sự nghiệp trong các buổi phỏng vấn."
        },
        {
            "time": "14h",
            "english_title": "Salary Negotiator",
            "vn_detail": "Có thể thương lượng mức lương và giải thích lý do tăng lương một cách tự tin."
        },
        {
            "time": "35h",
            "english_title": "Collaborative Leader",
            "vn_detail": "Có khả năng giao tiếp hiệu quả với khách hàng và phối hợp với các phòng ban khác nhau."
        },
        {
            "time": "50h",
            "english_title": "Strategic Communicator",
            "vn_detail": "Có thể thảo luận về xu hướng lương thị trường và tham gia vào các cuộc thảo luận chiến lược liên quan đến công ty."
        }
    ]
}
```

# B. Từ User Profile + Week-1Topic-5Scenario => 20 Chunking 

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
# C1. User Profile + 1Week-1Topic-1Scenario-1Question => Detail Chunking 


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

# C1-D. Từ each Detail Chunking => gen 4 Learning Meaning Exercise API

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

# C2. With each 4 Questions from Output B: User Profile + 1 Week-1 Topic-1 Scenario-4 Questions => Generate Learning Onion API

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
# 

# E. Generate Audio

http://103.253.20.13:3000/api/generate-audio

cURL Example:
```bash
curl -X POST \
  http://103.253.20.13:3000/api/generate-audio \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "Hello. Its me. Can you tell me?",
    "voice": "en-AU-WilliamNeural",
    "speed": 1
  }'
```

Input:
```json
{
    "text": "Hello. Its me. Can you tell me?",
    "voice": "en-AU-WilliamNeural",
    "speed": 1
}
```

Response:
```json
{
    "error": "Failed to generate audio"
}
```

Required Input Parameters:
- text: String containing the text to convert to speech (required)
- voice: String specifying the voice to use (optional, default: "en-AU-WilliamNeural")
- speed: Number specifying the speech rate (optional, default: 1)

Error Responses:
- 400 Bad Request: If text parameter is missing
- 500 Internal Server Error: If audio generation fails

Features:
- Text-to-speech conversion
- Multiple voice options
- Adjustable speech rate
- Error handling 

# C3. User Profile + Question => Phát triển ý (PTY - Onion Learning Method)

```bash
curl -X POST \
  http://103.253.20.13:3000/api/generate-learning-pty \
  -H 'Content-Type: application/json' \
  -d '{
    "mainQuestion": "What progress has been made since last week?"
}'
```

http://103.253.20.13:3000/api/generate-learning-pty

Input:
```json
{
    "mainQuestion": "What progress has been made since last week?"
}
```

Response:
```json
{
    "systemPrompt": "Take turns and role-play with me. You are Onion Guru...",
    "firstMessage": "Hello there! I can help you expand your answer to increase your fluency. Let's start with the main question: What progress has been made since last week?"
}
```

Required Input Parameters:
- mainQuestion: The question that needs to be expanded/practiced

Response Fields:
- systemPrompt: The complete Onion Guru prompt template that guides the conversation
- firstMessage: The initial message to start the practice session
