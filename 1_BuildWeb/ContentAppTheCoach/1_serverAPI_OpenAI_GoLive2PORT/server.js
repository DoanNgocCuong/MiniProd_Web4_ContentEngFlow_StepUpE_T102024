const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('src'));

const PORT = process.env.PORT || 3001;

app.post('/api/openai', async (req, res) => {
    try {
        const { systemPrompt, userInputPrompt } = req.body;
        
        if (!systemPrompt || !userInputPrompt) {
            return res.status(400).json({ 
                error: 'System prompt and user input prompt are required' 
            });
        }

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userInputPrompt }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({ result: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate questions' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});