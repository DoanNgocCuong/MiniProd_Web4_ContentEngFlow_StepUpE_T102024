1. How run backend localhost: 

## Prerequisites
- Node.js >= 18.0.0
- npm (Node Package Manager)
- OpenAI API Key

## Setup Steps

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
   - Copy `.env.example` to `.env`
   - Update the following variables in `.env`:
     ```
     NODE_ENV=development
     PORT=3000
     OPENAI_API_KEY=your_openai_api_key_here
     ```

3. Start the server:

   For development mode (with hot reload):
   ```bash
   npm run dev
   ```

   For production mode:
   ```bash
   npm start
   ```

4. The server will start on http://localhost:3000

## Troubleshooting
- If you see security vulnerabilities, run: `npm audit fix`
- Make sure all environment variables are set correctly in `.env`
- Check if port 3000 is available on your machine 
```

