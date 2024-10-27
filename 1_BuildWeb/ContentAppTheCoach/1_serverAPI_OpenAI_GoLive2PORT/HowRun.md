I'll help you refactor the baseJS_HTML code to make it more organized and maintainable. Here's the refactored version:

1. First, let's restructure the project to follow a better organization:

```
baseJS_HTML/
├── src/
│   ├── js/
│   │   ├── api.js // file này để gọi API từ server.js - http://localhost:3001/api/openai
│   │   ├── ui.js // file này để hiển thị giao diện người dùng - 1 PORT: 3000, set up trong .vscode/settings.json
│   │   └── main.js // file này để kết nối các file js với nhau 
│   ├── css/
│   │   └── style.css // file này để style giao diện người dùng
│   └── index.html // file này để hiển thị giao diện người dùng
├── .env // file này để lưu API key
└── server.js // file này để chạy server - 1 PORT: 3001 (server call API từ OpenAI)
```

1. Create a `.env` file in the root directory with your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

2. Install dependencies:
```bash
npm install express cors dotenv axios <if don't have package.json> / npm install
```

3. Run the server:
```bash
node server.js
```

This refactored version provides better maintainability, error handling, and user experience while keeping the core functionality intact.