deploy1.1 - 2 dạng đầu 
deploy1.2 - Hoàn thiện 4 dạng 
deploy1.3 - Update Dạng 3, 4 xài Prompt + Logic => Siêu nhanh
deploy1.4 - Update Feedback, Tracking - log 2 Larkbase => Done - Cuối T11, 12 năm 2024 - KIẾN TRÚC MVC (Model, View, Controller). 
deploy1.5 - Cuối T2 năm 2025. 

```
cường ơi, check lại giúp chị cái web gen câu hỏi của The Coach nha vì tháng này sắp mass produce tình huống cho dự án personalize nên muốn nhờ em check lạihttp://103.253.20.13:25007/1. Nghĩa tiếng Việt ở tab learning card / Flexible phrase vẫn đang để bot tự gen chứ chưa phải là lấy data từ các ô tiếng Việt đã được chị sửa ở phần Generated questions
2. Clarify giúp chị là maximum bot có thể gen được bao nhiêu câu hỏi vì hôm trước chị thử 13 câu là nó tèo
3. Thi thoảng bị lỗi code 500 khi gen Learning meaning, flexible phrase4. Phần Learning Meaning cần: 
   + bổ sung thêm câu hỏi về cấu trúc câu (như ảnh 2). Mỗi cụm cấu trúc trong bài sẽ có 1 câu hỏi, các đáp án nhiễu sẽ là câu ngược nghĩa hoặc phủ định của câu đúng
   + Phần giải thích đáp án sai bị dài chỉ cần áp dụng đúng format này là được 
“<r>[English word]</r> mang nghĩa là "[Nghĩa tiếng Việt]" nên sai nghĩa so với yêu cầu của đề bài. “
103.253.20.13
```

### Báo cáo Cập nhật Ứng dụng - Tháng 1/2024

#### 1. Cải thiện UI Loading
- Thay thế spinner đơn giản bằng thanh tiến độ (progress bar) chuyên nghiệp
- Hiển thị phần trăm hoàn thành cho người dùng
- Thêm hiệu ứng gradient animation cho thanh tiến độ
- Cập nhật tiến độ real-time trong quá trình xử lý

#### 2. Tối ưu hóa Xử lý API
- Triển khai xử lý song song với maxWorkers (4-5 API cùng lúc)
- Giảm thời gian xử lý tổng thể xuống 60-70%
- Tự động điều chỉnh số lượng workers dựa trên tải hệ thống
- Thêm cơ chế retry và error handling cho API calls

#### 3. Hệ thống Cache Thông minh
- Cache tự động cho 4 loại học tập (Meaning, Card, Flexible, QNA)
- Gen sẵn tất cả bài học ngay sau khi Gen Questions
- Chuyển đổi tab tức thì không cần đợi API
- Tự động làm mới cache khi có thay đổi dữ liệu
- Tăng tốc x2-x3 quá trình sinh nội dung mới

##### Kết quả đạt được
1. **Hiệu suất**: 
   - Giảm 70% thời gian chờ đợi
   - Chuyển tab mượt mà, tức thì

2. **Trải nghiệm người dùng**:
   - UI/UX chuyên nghiệp hơn
   - Phản hồi nhanh hơn
   - Thông tin tiến độ rõ ràng

3. **Tài nguyên hệ thống**:
   - Giảm 60% số lượng API calls
   - Sử dụng cache hiệu quả
   - Xử lý đồng thời tối ưu

##### Kế hoạch tiếp theo
1. Tối ưu hóa thêm maxWorkers
2. Thêm tính năng offline mode
3. Cải thiện UI/UX loading dialog


# Deploy 2.1 - Update full luong tu User
- Lak: https://csg2ej4iz2hz.sg.larksuite.com/wiki/N4awwdSlniF6H9kDpkRlXHHQgEh?from=from_copylink
- Figma: https://www.figma.com/board/L64qlDmfbPXPc91fizNBSI/AI-gen-flow?node-id=26-513&t=11PpsKabQXSCyMrn-1
- UUer input toan bo profile => ... 
- Full luong tu 
```
1. MỤC TIÊU CHÍNH THÔNG LUỒNG
✅ Input: User Profile
✅ Gen 10 Chủ đề + 50 Tình huống + 1 ✅ QC tự động LLMs check 
✅ Gen 4 bài Chunking mỗi tình huống (15 tình huống đầu A2, 15 tình huống sau B1, 10 tình huống cuối B2 -> mục tiêu tránh trùng lặp).  
✅ Gen bài Onion từ 4 bài Chunking 
✅ Gen bài PTY từ 1 bài Chunking
✅ Gen ảnh + audio tương ứng  [Tạm chưa ưu tiên]
✅ Output đầy đủ (JSON/markdown)
2. IMPROVE PROMPT ĐỂ XEM MỨC ĐỘ ĐẠT Ở TỪNG PHẦN ĐẾN ĐÂU. 
✅ Người QC => Report ACC từng bước. 
```