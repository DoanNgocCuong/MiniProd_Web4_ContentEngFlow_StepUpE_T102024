# Bản đánh giá thực tập sinh

### **1. Thông tin cá nhân**

- Họ và tên: Đoàn Ngọc Cường
- Vị trí thực tập: AI Intern
- Thời gian thực tập: Từ ngày 27/06/2024 đến ngày 28/08/2024
- Người hướng dẫn: Vũ Cao Cường, Lê Văn Trúc

---

### **2. Mục tiêu cá nhân ban đầu**

(Những mục tiêu nào cho bản thân trong thời gian thực tập này?)

1. CHUYÊN MÔN: Phát triển với định hướng: LLMs, Prompting, Chatbot → Product Manager.

⇒  Tìm kiếm MENTOR, môi trường phát triển đường dài cùng nhau. 

1. KINH NGHIỆM THỰC TẾ: Tích luỹ kinh nghiệm môi trường doanh nghiệp → ra Sản Phẩm → ra money.
2. THỰC TẬP ĐÁP ỨNG YÊU CẦU TRƯỜNG: Nguyện vọng công ty có thể join được vào hệ thống thực tập trường ⇒ đáp ứng được luôn môn “Intership” mà trường yêu cầu. 

---

### **3. Đầu việc, Kết quả (Outcome) và Tác động (Impact)**

| **Dự án/Đầu việc** | **Mô tả nhiệm vụ** | **Kết quả đạt được (Outcome)** | **Công nghệ/Kỹ thuật sử dụng** | **Tác động (Impact)** |
| --- | --- | --- | --- | --- |
| [**TASK1_Speech2Text2SignRoles**](https://husteduvn-my.sharepoint.com/:f:/g/personal/cuong_dn210141_sis_hust_edu_vn/EkUCefAx0ENFsPVM57fdFSoBJdN36-vV9dNL3On45MuHKw?e=E4jNdD) | 1. Từ cuộc gọi Saler ⇒ Chuyển thành Văn bản có phân vai (được cung cấp API Whisper). 
2. Sử dụng thêm GPT4, API Key GPT4 để cải thiện output ở bước 1. 
3. Build UI phân vai để giúp Team Leader có thể xem lại cuộc gọi nhanh hơn.  | 3. Build thành công UI. | - Prompting cải thiện đầu ra sau khi Speech2Text. | 0 |
| [**Task2_ContentGeneration](https://husteduvn-my.sharepoint.com/:f:/g/personal/cuong_dn210141_sis_hust_edu_vn/EoNa1qYShZ1IgaUZ67Ku-SAB2ht5huOnk3JPmLeDJSypoQ?e=xih0gR)**

Prompting các dạng bài phần “ÔN TẬP APP THE COACH”. | Từ  9 cụm sẵn ⇒ gen câu chuyện hội thoại chứa 9 cụm. 

Sau đó gen các dạng bài ôn tập
1. Dạng điền vào chỗ trống 
2. Dạng chọn đáp án phù hợp: 
3. Dạng nói để trả lời
4. Dạng điền phần còn thiếu  | - Hoàn thành 3 dạng được giao: dạng 1, 2, 4 

- Đóng gói flow” gần xong (tầm 85%) flow từ: 9 cụm  ⇒ output cuối.  | Prompting use API chatGPT4o. | +, Dạng bài ôn tập tiếng anh - test trên app The Coach.  |
| [**Task3_ImageGeneration**](https://husteduvn-my.sharepoint.com/:f:/g/personal/cuong_dn210141_sis_hust_edu_vn/EqebxywlTbFPlUZmcgIMHhgBh3mYKBOY3g5TemnK0zJHbw?e=ltagXO) | 1. Gen đợt 1: giữa T7, gen ảnh cho dạng bài ở Task 2 bên trên
(Ảnh minh hoạ cho đoạn text cho sẵn). 

2. Gen đợt 2: Cuối tháng 7, gen ảnh cho “LUỒNG CHUNKING” mới. 
(yêu cầu cao hơn đợt 1, ảnh cần thể hiện được chính xác hơn nội dung cụm từ để user nhìn vào ảnh có thể đoán được cụm từ). - 150 ảnh.  | Hoàn thành các phần ảnh được giao. 

- Tổng đợt 1: 50 ảnh - Stable Diffusion with ComfyUI 

- Tổng đợt 2: Hoàn thành 150 ảnh - Flux1 with ComfyUI | Dalle3, Stable Diffusion with ComfyUI, → Flux1 with ComfyUI | +, Dạng bài ôn tập tiếng anh - Test trên app The Coach. 

+, Ảnh cho luồng “CHUNKING“ mới - Test trên app The Coach.  |
| [**Task4_Topic_Situation_ContentGen**](https://husteduvn-my.sharepoint.com/:f:/g/personal/cuong_dn210141_sis_hust_edu_vn/Ems-S7fvMzlDiOEG9g4BGzMBsQjQSmBJ9a1_og-FzyQESQ?e=o6HlpF) | Gen các tình huống có thể gặp phải với 19 roles khác nhau của người dùng. 

 | 1. Xác định tiêu chí của 1 câu chuyện 10 điểm 
2. Prompting build 49 tình huống cho mỗi roles → output: file google sheet.  | Playground của OpenAI (Get JSON tình huống) | +, tình huống được gửi cho team Sale để tư vấn → Impact ko quá nhiều.  |
| [**TASK5_GPTschatbot_TestingSale**](https://husteduvn-my.sharepoint.com/:f:/g/personal/cuong_dn210141_sis_hust_edu_vn/EhnLEANCMbBBsmgz15AnCdcByupt3ncwPXEZD5A1TrF9SQ?e=xTpMC4) | Build hệ thống kiểm tra cho Sale Team.  | *** Define requirements từ Sale Team. 

*** Thử nghiệm các giải pháp: GPTs → to App (TN xài logic, TL xài Prompting)

*** Hoàn tất hệ thống có thể sử dụng được: 
1. Build bộ câu hỏi kiểm tra gồm trắc nghiệm và tự luận. (Phối hợp cùng Sale Team Leader)
2. Build UI gradio for USER (saler sẽ sử dụng để kiểm tra) 
3. Build UI gradio for ADMIN (để cập nhật câu hỏi) | 1. GPT4 (để tạo bộ câu hỏi)
2. Prompting (tự động chấm điểm tự luận). 
3. Build UI gradio for USER, ADMIN.  | App có thể xài được cho sale để “Testing salers”

→ Cải thiện chất lượng đội ngũ sale.  |
| [**TASK6_ImporveGrammar**](https://husteduvn-my.sharepoint.com/:f:/g/personal/cuong_dn210141_sis_hust_edu_vn/Einy2X2pYRpHr6K2qI1nze4BILO0Sssf_K10C_9I1bWy8A?e=O71YzZ) | 6.1. Cho 1 câu ⇒ Prompt đánh dấu câu bị lỗi. 

6.2. Prompting nhỏ phần Ôn tập web IELTS. 
- Input: Cho 3 câu hỏi, user ôn tập 3 câu hỏi

⇒ Output: Cần prompting câu trả lời để tương tác với user, giúp user ôn tập 3 câu hỏi.  | 6.1. Hoàn thành 

6.2. 
- Hoàn thành Prompt ôn tập. 
- Tạo kiểm thử hàng loạt để CHECKING PROMPT (3 chủ đề, 30 cases).  | 6.1. Prompting with model Llama3-70B

6.2 Prompting trên Playground chatGPT4 | 6.1 → impact = 0 

6.2 → impact: được xài trên test của IELTS.  |

*Ghi chú: Nếu có thể, hãy cụ thể hóa tác động bằng số liệu (ví dụ: Tối ưu hóa hiệu suất mô hình, giảm thời gian xử lý...)*

---

### **4. Đánh giá năng lực và tiềm năng phát triển**

- **Kỹ năng chuyên môn**: (Đánh giá khả năng về Machine Learning, Data Science, Lập trình, v.v.)
    - Đánh giá từ 1-5 (1: Yếu, 5: Xuất sắc): 3
    - Điểm mạnh: 
    1. coding (with about 500 dòng code), 
    2. prompting gần đây ngắn gọn hơn (gần nhất là prompt cơ chế chấm điểm cho sales), 
    3. có tiến bộ trong define bài toán, define giải pháp, rủi ro (trong task gần nhất: “Hệ thống Kiểm tra đơn giản cho Sale”)
    - Điểm cần cải thiện:
        1. Prompting clear hơn đi từ output đi ra. 
        2. Cải thiện Tiếng Anh, tư duy Prompt ảnh cần cải thiện
        3. DEFINE KỸ HƠN: Define kỹ vấn đề → define kỹ giải pháp (tìm kiếm các giải pháp tối ưu, triển khai giải pháp trong đầu để define rủi ro từng giải pháp). 
        4. LINH HOẠT HƠN, SÁNG TẠO HƠN (TRÁNH BỊ LỐI MÒN): Cần nhìn xa hơn, tổng quan hơn, dự trù rủi ro kỹ hơn, đặt câu hỏi thông minh hơn để lấy requirements, Giải pháp sáng tạo hơn. 
- **Kỹ năng mềm**: (Khả năng làm việc nhóm, giao tiếp, quản lý thời gian, v.v.)
    - Đánh giá từ 1-5 (1: Yếu, 5: Xuất sắc): 4
    - Điểm mạnh:
        
        1. ham học hỏi, nhận việc để được phát triển,
        2. có định hướng khá rõ ràng: LLMs, Prompting, Chatbot, Content Creator → Software Engineering →Product Manager 
        3. Xin feedback của anh chị thường xuyên + có cải thiện. 
        
    - Điểm cần cải thiện:
        1. Giao tiếp hiệu quả hơn khi gặp khó khăn (red flag) ⇒ Raise lên để xin tham vấn. 
        2. Lắng nghe và suy nghĩ trước khi vội phản hồi, lấy cớ, viện lý do này kia cho vấn đề được feedback. 
- **Tiềm năng phát triển**:
    - Bạn thấy mình có tiềm năng phát triển trong lĩnh vực nào?
    1. Các hệ thống NO-CODE: LLMs, Prompting, Chatbot, Content Creator 
    2. Idea for App, minh chứng:
        - Trước khi vào The Coach, cũng có 1 vài ý tưởng hay nhắn với chị Trang (khá trùng với idea các anh chị định build).
        - Idea gần nhất: AI như MENTOR, CỐ VẤN NỘI DUNG HỌC MỖI NGÀY ⇒ Giúp người học KO CẦN SUY NGHĨ NAY HỌC GÌ MAI HỌC GÌ, cá nhân hoá như các dịch vụ coaching 1-1. 
         (Lộ trình được cập nhật làm mới hàng ngày dựa vào tiến độ người học)
    - Kế hoạch học hỏi và phát triển bản thân trong 6 tháng tới là gì?
        1. Cải thiện tư duy “Problem Solving”: từ define bài toán, define giải pháp , define nguồn lực (công nghệ, người có thể support mình), define rủi ro, … 
        2. Prompting thuần thục hơn, học `Auto Prompting` từ a Trúc và bên ngoài => RA KẾT QUẢ với các task được giao => làm chính thức ở The Coach. 
        3. Việc học ở trường năm cuối tầm (25 tín cho 2 kỳ học nữa) và Tiếng anh. 
        4. (MỤC HIỆN TẠI KHÔNG ƯU TIÊN CAO): Phối hợp các công nghệ NO-CODE/LOW-CODE ⇒ ra sản phẩm: chatbot/video content/app AI/… (kinh doanh riêng thêm vào các thị trường xanh) + Update CHUYÊN MÔN - CON NGƯỜI - KINH DOANH ⇒ Lương.  

---

### **5. Thái độ trong công việc**

- **Tính chủ động**: Bạn đã chủ động trong công việc, tìm kiếm giải pháp cho các vấn đề chưa?
    - Dần chủ động hơn trong việc define giải pháp, dự trù risk cho các giải pháp khác nhau, phối hợp giải pháp (gần nhất: UI for admin sale update câu hỏi, thay vì build UI mới chỉnh sửa file trên UI hay là build cơ chế tự động đồng bộ từ google sheet ⇒ Đề xuất giải pháp mới: chỉnh sửa trên file google sheet vừa đơn giản, sau đó ấn ĐỒNG BỘ tránh được các lỗi do cơ chế đồng bộ tự động).
- **Thái độ với đồng nghiệp và công ty**: Bạn có sẵn sàng hợp tác và hỗ trợ đồng nghiệp trong quá trình làm việc không?
    - Phối hợp nhịp nhàng.
- **Sự cầu thị và tinh thần học hỏi**: Bạn có sẵn sàng lắng nghe phản hồi và cải thiện kỹ năng của mình không?
    - Chủ động xin feedback của mentor, xin tài liệu/nguồn học, xin chỉ dẫn.
    - Tuy nhiên chú ý hơn: việc lắng nghe và tư duy trước khi vội phản hồi, lấy cớ, viện lý do cho vấn đề.

---

### **6. Phản hồi từ bạn về quá trình thực tập**

- Bạn đánh giá như thế nào về môi trường làm việc tại công ty?
    - Môi trường Start Up năng động, liên tục cập nhật cái mới, dễ tiến bộ dễ bị đào thải.
    - Tư duy Problem Solving mạnh, (có các buổi review, kaizen để lắng nghe feedback của đồng đội từ đó cải tiến)
- Bạn có nhận được sự hỗ trợ và hướng dẫn đầy đủ từ người hướng dẫn không?
    - Mentor: a Cường định hướng lộ trình và tư duy Problem Solving.
    - Mentor: a Trúc với các task cụ thể hơn, cách tư duy Problem Solving (lấy requirements, define solutions tránh lối mòn, dự trù rủi ro và hướng giải cho rủi ro trước khi nhảy vào 1 solution nào đó), các tools và kỹ năng đóng gói, AUTOMATION và LÀM NHÀN - LÀM ÍT ĐƯỢC NHIỀU CÓ KẾT QUẢ (quá đau với task GEN ẢNH - MẤT QUÁ NHIỀU THỜI GIAN - IMPACT/OUTCOME LẠI KO NHIỀU).
- Bạn có đề xuất gì để cải thiện trải nghiệm thực tập tại công ty cho những thực tập sinh sau?
    1. Về xa hơn, có thể khai thác hơn khía cạnh Product từ em (khía cạnh UX người dùng, khía cạnh kinh doanh)
        - Trước khi thực tập, em có xài app từ 2023 có 1 số mong muốn trong lúc học nên là em tìm cách kết nối với chị Trang từ lúc đó. 1 số feedback từ em: build phần ôn tập, xài so sánh các app tiếng anh nên cũng có feedback, … (Có 1 số cái trùng với idea của a chị) ⇒ Có đợt chị Trang muốn mời em vào team “Thiết kế” - em sẽ được học thêm về Product Design mà đợt đó em bận (ĐỢT CÓ LUỒNG ÔN TẬP NHÂN VẬT: HÀNH ONION)
        - Tuy không quá mạnh, nhưng em khá thích tư duy vẽ vời idea, giải pháp, UX cho app vì đã từng là người dùng thực.
        - Thích làm việc với con người và kinh doanh, thích định hướng chiến lược dài hạn (chẻ từ mục đích cuộc sống, lộ trình 5-10 năm, … copy mô hình kinh doanh, …), thích nghiên cứu tâm lý người dùng, giải pháp 1 kèm 1, …
    
    =================
    Em cần cải thiện hơn: PROBLEM SOLVING: define XA HƠN, LINH HOẠT HƠN, SÁNG TẠO HƠN TRÁNH LỐI MÒN. 
    

---

### **7. Kết luận**

- **Điểm mạnh nhất mà bạn đã phát triển trong quá trình thực tập là gì?**
    
    đang phát triển là: PROBLEM SOLVING (Define kỹ bài toán (Đặt câu hỏi lấy requirements) - Define kỹ giải pháp - Dự trù Resources (Human Resouces, Material Resources) - Risk and Plan for Risk - Thực thi). 
    
- **Điểm yếu nào bạn cảm thấy cần tập trung cải thiện?**
    
    là: PROBLEM SOLVING CẦN: NHÌN XA HƠN, TỔNG QUAN HƠN, LINH HOẠT HƠN, SÁNG TẠO HƠN (TRÁNH BỊ LỐI MÒN): Cần nhìn xa hơn, tổng quan hơn, dự trù rủi ro kỹ hơn, đặt câu hỏi thông minh hơn để lấy requirements, Giải pháp sáng tạo hơn.