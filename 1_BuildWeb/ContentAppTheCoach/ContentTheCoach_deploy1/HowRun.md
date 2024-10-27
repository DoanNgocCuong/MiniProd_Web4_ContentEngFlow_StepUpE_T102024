# How Run Docker Compose
. Run: 
```bash
# Build images
docker-compose build   # docker-compose build --no-cache

# Start services
docker-compose up -d
```

3. Chạy 

Frontend:
Mở trình duyệt và truy cập: http://localhost
Hoặc: http://localhost:80
Backend (để test API):
http://localhost:3000/api

4. Bug fix: 
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

==================
# Đọc thêm: 

Here's a `HowRun.md` file for your colleague:

# Project Setup and Deployment Guide

## Prerequisites
- Node.js >= 18.0.0
- Docker and Docker Compose
- Git

## Project Structure
```
.
├── backend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
└── frontend/
    ├── src/
    ├── Dockerfile
    └── index.html
```

## Environment Setup

1. Create `.env` file in `backend` directory:
```env
NODE_ENV=production
PORT=3000
OPENAI_API_KEY=your_openai_api_key_here
```

2. Update frontend configuration in `frontend/src/js/config.js`:

```1:11:frontend/src/js/config.js
const config = {
    development: {
      apiUrl: 'http://localhost:3000/api'
    },
    production: {
      apiUrl: 'http://backend:3000/api'  // Docker service name
    }
};
  
const environment = process.env.NODE_ENV || 'development';
export default config[environment];
```


## Docker Deployment

1. Build and run containers:
```bash
# Clone repository
git clone [repository-url]
cd [project-directory]

# Build containers
docker-compose build

# Start services
docker-compose up -d
```

2. Verify services:
- Frontend: http://localhost:80
- Backend: http://localhost:3000

## API Endpoints

The backend exposes three main endpoints:

```8:10:backend/src/routes/index.js
router.post('/generate-questions', questionsController.generateQuestions);
router.post('/generate-learning-meaning', learningMeaningController.generateLearningMeaning);
router.post('/generate-learning-card', learningCardController.generateLearningCard);
```


## Troubleshooting

1. If OpenAI API fails:
- Check OpenAI API key in `.env`
- Verify model name in controllers:

```10:21:backend/src/controllers/generateQuestionsController.js
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { 
                    role: 'system', 
                    content: 'You are an expert at English lesson topic-related content generating. Return an array of question objects in JSON format.' 
                },
                { role: 'user', content: prompt}
            ],
            max_tokens: 3000,
            temperature: 0
        });
```


2. If frontend can't connect to backend:
- Check CORS settings in:

```8:10:backend/src/server.js
app.use(cors());
app.use(express.json());
app.use('/api', routes);
```


## Monitoring

- Backend logs:
```bash
docker-compose logs -f backend
```

- Frontend logs:
```bash
docker-compose logs -f frontend
```

## Development Mode

To run in development mode:

1. Backend:
```bash
cd backend
npm install
npm run dev
```

2. Frontend:
- Simply open `frontend/src/index.html` in a browser
- Or use the provided Docker setup

## Important Notes

1. Security:
- The OpenAI API key is sensitive - ensure it's properly secured
- CORS is currently open - restrict in production

2. Performance:
- Frontend is served via http-server - consider using Nginx for production
- Backend uses Express.js with basic configuration

## Support

For any issues:
1. Check Docker container logs
2. Verify environment variables
3. Ensure all ports are available (80, 3000)

Need help? Contact: [Your Contact Information]