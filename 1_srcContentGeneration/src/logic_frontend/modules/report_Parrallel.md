# Báo Cáo Chi Tiết Về Xử Lý Song Song (Parallel Processing)

## 1. Tổng Quan
Trong dự án này, chúng ta đã triển khai xử lý song song cho việc tạo câu hỏi chi tiết từ dữ liệu đầu vào. Có hai phiên bản:
- `C_run20Ques_From1QuestionGenDetailChunking.py`: Xử lý 20 câu hỏi đầu tiên
- `C_run200Ques_From1QuestionGenDetailChunking.py`: Xử lý toàn bộ 200 câu hỏi

## 2. Kiến Trúc Xử Lý Song Song

### 2.1. Cấu Trúc Cơ Bản
```python
with concurrent.futures.ThreadPoolExecutor(max_workers=N) as executor:
    # Xử lý theo batch
    for i in range(0, len(all_questions), batch_size):
        batch = all_questions[i:i + batch_size]
        batch_futures = [executor.submit(process_question, args) for args in batch]
```

### 2.2. Các Thành Phần Chính

#### 2.2.1. ThreadPoolExecutor
- Quản lý pool các worker threads
- `max_workers`: Số lượng worker tối đa
  - 20 câu: 5 workers
  - 200 câu: 10 workers

#### 2.2.2. Batch Processing
- Chia nhỏ dữ liệu thành các batch
- 20 câu: batch_size = 5
- 200 câu: batch_size = 20

#### 2.2.3. Future Objects
- Đại diện cho kết quả tính toán bất đồng bộ
- Theo dõi trạng thái của mỗi task

## 3. Chi Tiết Triển Khai

### 3.1. Xử Lý 20 Câu Hỏi
```python
batch_size = 5  # 5 câu mỗi batch
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    for i in range(0, len(all_questions), batch_size):
        batch = all_questions[i:i + batch_size]
        batch_futures = [executor.submit(process_question, args) for args in batch]
```

### 3.2. Xử Lý 200 Câu Hỏi
```python
batch_size = 20  # 20 câu mỗi batch
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
    for i in range(0, len(all_questions), batch_size):
        batch = all_questions[i:i + batch_size]
        batch_futures = [executor.submit(process_question, args) for args in batch]
```

## 4. Xử Lý Lỗi và Giám Sát

### 4.1. Xử Lý Lỗi
```python
try:
    result = future.result()
    if result:
        results.append(result)
        print(f"Processed {len(results)}/total questions")
except Exception as e:
    print(f"Error in batch processing: {str(e)}")
```

### 4.2. Theo Dõi Tiến Trình
- Hiển thị số câu đã xử lý
- Hiển thị tiến độ của từng batch
- Thông báo khi hoàn thành mỗi batch

## 5. Tối Ưu Hóa Hiệu Suất

### 5.1. Cấu Hình Retry
```python
retries = Retry(
    total=5,
    backoff_factor=3,
    status_forcelist=[500, 502, 503, 504],
    allowed_methods=['POST']
)
```

### 5.2. Thời Gian Chờ
- Delay giữa các request: 2 giây
- Timeout cho mỗi request: 120 giây

## 6. Lưu Trữ Kết Quả

### 6.1. Định Dạng Xuất
- Excel file: `.xlsx`
- JSON file: `.json`

### 6.2. Cấu Trúc Dữ Liệu
```python
columns = [
    "week", "topic", "scenario", "original_question",
    "question", "structure", "main phrase", "optional phrase 1", "optional phrase 2",
    "question-vi", "structure-vi", "main phrase-vi", "optional phrase 1-vi", "optional phrase 2-vi"
]
```

## 7. Ưu Điểm của Cách Triển Khai

1. **Hiệu Suất Cao**
   - Xử lý nhiều câu hỏi cùng lúc
   - Tận dụng tối đa tài nguyên hệ thống

2. **Độ Tin Cậy**
   - Xử lý lỗi theo batch
   - Cơ chế retry tự động
   - Không mất dữ liệu khi có lỗi

3. **Dễ Theo Dõi**
   - Hiển thị tiến độ rõ ràng
   - Thông báo lỗi chi tiết
   - Dễ dàng debug

4. **Linh Hoạt**
   - Dễ dàng điều chỉnh số lượng worker
   - Có thể thay đổi kích thước batch
   - Hỗ trợ cả xử lý ít và nhiều câu hỏi

## 8. Hạn Chế và Cách Khắc Phục

1. **Tải Server**
   - Giải pháp: Thêm delay giữa các request
   - Giải pháp: Giới hạn số lượng worker

2. **Bộ Nhớ**
   - Giải pháp: Xử lý theo batch
   - Giải pháp: Lưu kết quả thường xuyên

3. **Lỗi Mạng**
   - Giải pháp: Cơ chế retry
   - Giải pháp: Timeout hợp lý

## 9. Kết Luận

Việc triển khai xử lý song song trong dự án này đã mang lại nhiều lợi ích:
- Tăng tốc độ xử lý đáng kể
- Đảm bảo độ tin cậy của hệ thống
- Dễ dàng mở rộng và bảo trì
- Có thể áp dụng cho các dự án tương tự 