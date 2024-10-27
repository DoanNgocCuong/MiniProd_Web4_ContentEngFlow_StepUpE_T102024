// server.js

import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Middleware để phân tích dữ liệu JSON
app.use(express.json());

// Tạo endpoint để gọi OpenAI API
app.post('/api/generate-questions', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are an expert at English lesson topic-related content generating, only respone in json' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 3000,
                temperature: 0.7
            })
        });

        const data = await response.json();
        res.json(data); // Trả về kết quả JSON cho frontend
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error fetching data from OpenAI API' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
