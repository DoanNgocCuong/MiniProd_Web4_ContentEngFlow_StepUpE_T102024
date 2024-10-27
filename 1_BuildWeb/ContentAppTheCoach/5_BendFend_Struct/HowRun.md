- Version hiện tại dùng hoàn toàn trên frontend

===============
Trong version tới: sẽ có backend và frontend

I'll help you split this into a proper backend and frontend structure. Here's the recommended organization:

```
project/
project/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Nơi chứa các logic xử lý các request HTTP
│   │   ├── routes/            # Nơi chứa các endpoint của API (mỗi file route tương ứng với một module)
│   │   ├── config/            # Nơi chứa file cấu hình (như kết nối database, cấu hình server, v.v.)
│   │   └── server.js          # File chính khởi động server
│   ├── .env                   # File chứa các biến môi trường (cần bảo mật thông tin nhạy cảm)
│   └── package.json           # File cấu hình các dependency của backend
└── frontend/
    ├── src/
    │   ├── js/                # Nơi chứa các file JavaScript cho frontend (chia nhỏ theo từng component hoặc feature)
    │   ├── css/               # Nơi chứa các file CSS cho giao diện
    │   └── index.html         # File HTML chính của frontend
    └── package.json           # File cấu hình các dependency của frontend

```

## How to Run: 

```bash
# Terminal 1 (Backend)
cd backend
node src/server.js

# Terminal 2 (Frontend)
cd frontend
npm start
```


### Nếu cần thì: set up and run the project:

1. Backend setup:
```bash
cd backend
npm init -y
npm install express cors dotenv axios <if don't have package.json> / npm install
```

- express: Framework để xây dựng API
- cors: Cho phép truy cập API từ các domain khác
- dotenv: Quản lý biến môi trường
- axios: Thư viện để gọi HTTP requests


2. Create `.env` file in backend folder:
```
PORT=3000
OPENAI_API_KEY=your_api_key_here
```

3. Frontend setup:
```bash
cd frontend
npm init -y
npm install --save-dev live-server <if don't have package.json> / npm install
```

```json
{
  "scripts": {
    "start": "live-server src --port=8080"
  }
}
```

