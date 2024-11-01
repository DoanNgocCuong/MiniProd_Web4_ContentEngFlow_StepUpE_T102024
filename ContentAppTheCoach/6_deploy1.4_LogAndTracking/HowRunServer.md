File khi gửi cho đồng đội. 

1. File .env đã có API Key sẵn rồi
2. Thay dổi PORT frontend và backend trong file docker-compose.yml chẳng hạn 25007:25007 và 3000:3000

3. Đặt 
```
environment:
      - NODE_ENV=production 
```
trong file docker-compose.yml

Chỉnh sửa 5 files: `generateQuestion.js`, `generateLearningMeaning.js`, `generateLearningFlexible.js`, `generateLearningVocabulary.js`, `generateLearningGrammar.js` từ 
```
const API_URL = config.development.apiUrl;
```
thành 
```
const API_URL = config.production.apiUrl;
```

4. Đặt trong file frontend/src/js/script.js
```bash
const environment = process.env.NODE_ENV || 'development';
```


5. Run: 
```
docker-compose down

docker-compose build   # docker-compose build --no-cache

docker-compose up
```



-=========
Chi tiết hơn đẻ hiểu cơ chế: 


1. backend/Dockerfile: giao tiếp nội bộ PORT 3000 

=> API Fetch có 3 loại

```frontend/src/js/config.js
export const config = {
    // Môi trường development (phát triển): 
    // Sử dụng localhost vì frontend và backend chạy trên cùng máy tính
    development: {
      apiUrl: 'http://localhost:3000/api'
    },

    // Môi trường docker internal:
    // Sử dụng tên service 'backend' được định nghĩa trong docker-compose
    // để giao tiếp giữa các container trong mạng nội bộ Docker
    dockerInternal: {
      apiUrl: 'http://backend:3000/api'  // Docker service name
    },

    // Môi trường production (triển khai):
    // Sử dụng IP public của server để frontend có thể gọi API
    // từ bất kỳ đâu trên internet
    production: {
      apiUrl: 'http://103.253.20.13:3000/api' // IP public
    }
};

// Lấy giá trị môi trường từ biến môi trường NODE_ENV
// Nếu không có giá trị, mặc định sử dụng 'development'
const environment = process.env.NODE_ENV || 'development';

// Xuất cấu hình tương ứng với môi trường hiện tại
// Ví dụ: Nếu NODE_ENV='production' thì sẽ xuất config.production
export default config[environment];
```


2. frontend: đang để PORT: 25007 - giao tiếp khách với server 

