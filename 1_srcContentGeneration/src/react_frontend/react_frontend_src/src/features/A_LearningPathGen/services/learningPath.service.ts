import { UserProfileInput } from '../types/input';
import { LearningPathOutput } from '../types/output';

const API_URL = import.meta.env.VITE_API_URL;

export const generateLearningPath = async (
    input: UserProfileInput
): Promise<LearningPathOutput> => {
    try {
        // Format the input to match API requirements
        const formattedInput = {
            userProfile: `Industry: [${input.industry}]\n` +
                         `Job: [${input.job}]\n` +
                         `Gender: ${input.gender || 'Not specified'}\n` +
                         `Native language: ${input.nativeLanguage || 'Not specified'}\n` +
                         `English Level: [${input.englishLevel}]\n` +
                         `Learning goals: ${input.learningGoals.map(goal => `[${goal}]`).join(' ')}`
        };

        const apiUrl = `${API_URL}/api/generate-learning-path`;
        console.log('=== Learning Path API Call ===');
        console.log('API URL from env:', API_URL);
        console.log('Full Request URL:', apiUrl);
        console.log('Request Method: POST');
        console.log('Request Headers:', {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        console.log('Original Input:', input);
        console.log('Formatted Input:', formattedInput);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formattedInput),
        });

        console.log('Response Status:', response.status);
        console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('API Error Details:', {
                status: response.status,
                statusText: response.statusText,
                data: errorData
            });
            throw new Error(`Failed to generate learning path: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Response Data:', data);
        console.log('=== End Learning Path API Call ===');
        return data;
    } catch (error) {
        console.error('Error in generateLearningPath:', error);
        throw error;
    }
}; 