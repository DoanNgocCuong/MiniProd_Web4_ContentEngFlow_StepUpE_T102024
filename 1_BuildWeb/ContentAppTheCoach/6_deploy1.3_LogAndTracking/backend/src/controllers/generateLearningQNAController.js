const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

exports.generateLearningQNA = async (req, res) => {
    try {
        console.log('Received request for QNA phrases:', req.body);
        
        const { lessons } = req.body;
        const allResults = [];
        
        for (const lesson of lessons) {
            console.log('Processing QNA lesson:', lesson);
            
            const phrases = [
                lesson["main phrase"],
                lesson["optional phrase 1"],
                lesson["optional phrase 2"]
            ].filter(phrase => phrase);

            const placeholderMatch = lesson.structure.match(/_{2,}/);
            if (!placeholderMatch) {
                throw new Error('Structure must contain placeholder (at least 2 underscores)');
            }
            const placeholder = placeholderMatch[0];

            const lessonResults = phrases.map(phrase => {
                const sentence_en = lesson.structure.replace(placeholder, phrase.trim());
                
                const sentence_hide = sentence_en
                    .split('')
                    .map(char => /[a-zA-Z0-9]/.test(char) ? '_' : char)
                    .join('');
                
                return {
                    description: "TRẢ LỜI THEO TRANH GỢI Ý",
                    sentence_en,
                    sentence_hide
                };
            });

            allResults.push(...lessonResults);
        }
        
        console.log('Successfully generated QNA phrases:', allResults);
        res.json(allResults);
        
    } catch (error) {
        console.error('Error in generateLearningQNA:', error);
        res.status(500).json({ error: error.message });
    }
};