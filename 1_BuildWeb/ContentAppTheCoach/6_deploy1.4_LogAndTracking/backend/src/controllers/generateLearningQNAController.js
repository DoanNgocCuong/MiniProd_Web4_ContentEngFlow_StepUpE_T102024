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

            // Tạo mảng kết quả bằng cách map qua từng phrase
            const lessonResults = phrases.map(phrase => {
                // Thay thế placeholder trong cấu trúc câu bằng phrase đã được cắt khoảng trắng 2 đầu
                const sentence_en = lesson.structure.replace(placeholder, phrase.trim());
                
                // Tạo câu ẩn bằng cách:
                // 1. Tách chuỗi thành mảng các ký tự
                // 2. Thay thế các ký tự chữ và số bằng dấu gạch dưới '_' (sửa [a-zA-Z0-9] thành [a-zA-Z0-9'])
                // 3. Giữ nguyên các ký tự đặc biệt và khoảng trắng
                // 4. Nối lại thành chuỗi hoàn chỉnh
                const sentence_hide = sentence_en
                    .split('')
                    .map(char => /[a-zA-Z0-9']/.test(char) ? '_' : char)
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