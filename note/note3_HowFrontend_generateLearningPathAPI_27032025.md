# Frontend Development Documentation - Learning Path Generator
Ngày: 27/03/2024

## 1. Tổng Quan
Dự án này xây dựng một hệ thống tạo lộ trình học tiếng Anh dựa trên thông tin người dùng. Gồm 4 file chính:
- `index.html`: Cấu trúc giao diện
- `learningPath.js`: Xử lý logic chính
- `scripts.js`: Khởi tạo và xử lý sự kiện
- `learningPath.css`: Định dạng giao diện

### 1.1 Luồng Hoạt Động
1. User điền form thông tin cá nhân
2. Hệ thống gửi thông tin tới API
3. Nhận kết quả và hiển thị learning path
4. Cho phép copy kết quả

## 2. Chi Tiết Từng File

### 2.1 File index.html
```html
<!-- Cấu trúc cơ bản -->
<section id="user-profile-section">
    <form id="user-profile-form">
        <!-- Form nhập thông tin -->
    </form>
    <div id="learning-path-container">
        <!-- Kết quả sẽ hiển thị ở đây -->
    </div>
</section>
```
#### Giải thích:
- `user-profile-section`: Phần nhập thông tin user
- `user-profile-form`: Form với 4 trường:
  - Industry: Ngành nghề
  - Job: Công việc
  - English Level: Trình độ tiếng Anh
  - Learning Goals: Mục tiêu học tập
- `learning-path-container`: Nơi hiển thị kết quả

### 2.2 File learningPath.js
File này sử dụng OOP (Lập trình hướng đối tượng) với 2 class chính:

#### 2.2.1 Class LearningPathManager
```javascript
class LearningPathManager {
    constructor() {
        // Khởi tạo các thuộc tính cần thiết
        this.API_URL = config.production.apiUrl;
        this.cache = learningCache;
        this.currentUserId = null;
        this.data = null;
    }

    async generatePath(userProfile) {
        // Phương thức chính để tạo learning path
    }
}
```
**Chức năng:**
- Quản lý việc tạo learning path
- Giao tiếp với API
- Xử lý cache
- Quản lý dữ liệu

#### 2.2.2 Class LearningPathRenderer
```javascript
class LearningPathRenderer {
    constructor() {
        this.container = document.getElementById('learning-path-container');
    }

    async render(data) {
        // Hiển thị kết quả
    }
}
```
**Chức năng:**
- Hiển thị kết quả theo 4 phần:
  1. User Profile Description
  2. Communication Partners
  3. Learning Path (10 tuần)
  4. Milestones

### 2.3 File scripts.js
File này xử lý các sự kiện và khởi tạo:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo khi trang load xong
    console.log('DOM Content Loaded');

    // Tìm các elements cần thiết
    const userProfileForm = document.getElementById('user-profile-form');

    // Xử lý sự kiện submit form
    if (userProfileForm) {
        userProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Xử lý dữ liệu form
        });
    }
});
```
**Chức năng chính:**
1. Khởi tạo các components
2. Xử lý form submission
3. Gọi LearningPathManager
4. Xử lý lỗi

### 2.4 File learningPath.css
File CSS định dạng giao diện:

```css
/* Ví dụ một số styles quan trọng */
.user-profile-form {
    background: #fff;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.learning-path-section {
    margin-bottom: 30px;
    padding: 20px;
}
```
**Các phần chính:**
1. Form Styling
   - Input fields
   - Submit button
   - Layout

2. Results Styling
   - Profile section
   - Partners grid
   - Weekly path
   - Milestones

3. Responsive Design
   - Mobile-friendly
   - Grid adjustments

## 3. Cách Hoạt Động Chi Tiết

### 3.1 Khi User Submit Form:
1. `scripts.js` bắt sự kiện submit
2. Thu thập dữ liệu từ form
3. Format dữ liệu thành chuỗi:
```javascript
const userProfile = `
Industry: [IT]
Job: [Developer]
English Level: [A2]
Learning goals: [workplace communication]
`;
```

### 3.2 Xử Lý Learning Path:
1. `LearningPathManager` nhận dữ liệu
2. Kiểm tra cache
3. Nếu không có cache:
   - Gọi API
   - Hiển thị loading dialog
   - Cập nhật progress bar
4. Nhận kết quả và lưu cache

### 3.3 Hiển Thị Kết Quả:
1. `LearningPathRenderer` nhận data
2. Tạo các sections:
   - Profile
   - Partners
   - Weekly Path
   - Milestones
3. Thêm nút Copy
4. Hiển thị kết quả

## 4. Xử Lý Lỗi
- Kiểm tra elements tồn tại
- Try-catch cho API calls
- Hiển thị thông báo lỗi
- Console logging cho debug

## 5. Cải Tiến Có Thể Thực Hiện
1. Thêm validation cho form
2. Cải thiện UX loading
3. Thêm animations
4. Optimize performance
5. Unit testing

## 6. Lưu Ý Cho Người Mới
1. Học cách sử dụng DevTools (F12)
2. Hiểu về async/await
3. Nắm vững DOM manipulation
4. Học cách debug với console.log
5. Hiểu về event handling

## 7. Tài Liệu Tham Khảo
- MDN Web Docs
- JavaScript.info
- W3Schools
