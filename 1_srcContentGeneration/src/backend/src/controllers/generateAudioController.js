const axios = require('axios');

const generateAudio = async (req, res) => {
    try {
        const { text, voice = 'en-AU-WilliamNeural', speed = 1 } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const response = await axios.post('http://103.253.20.13:25010/api/text-to-speech', {
            text,
            voice,
            speed
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error generating audio:', error);
        res.status(500).json({ error: 'Failed to generate audio' });
    }
};

module.exports = {
    generateAudio
};