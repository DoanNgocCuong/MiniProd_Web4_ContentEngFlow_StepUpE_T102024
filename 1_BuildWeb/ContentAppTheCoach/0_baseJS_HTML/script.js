document.getElementById('generate-btn').addEventListener('click', async () => {
    const topic = document.getElementById('topic').value;
    const level = document.getElementById('level').value;
    const prompt = `Generate ${level} level questions on the topic of ${topic}.`;

    try {
        // Enter your OpenAI API key here
        const apiKey = '';

        if (!apiKey) {
            throw new Error('OpenAI API key is not defined');
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST', 
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.choices || data.choices.length === 0) {
            throw new Error('No response data received from API');
        }

        const container = document.getElementById('question-container');
        container.innerHTML = data.choices.map(choice => `<p>${choice.message.content}</p>`).join('');
    } catch (error) {
        console.error('API Error:', error);
        alert(`Error: ${error.message}`);
    }
});
