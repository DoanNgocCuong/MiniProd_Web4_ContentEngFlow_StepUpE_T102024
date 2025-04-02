import { UserProfileInput } from '../types/input';
import { LearningPathOutput } from '../types/output';

export const generateLearningPath = async (
    input: UserProfileInput
): Promise<LearningPathOutput> => {
    try {
        const apiUrl = '/api/generate-learning-path';
        console.log('=== Learning Path API Call ===');
        console.log('Request URL:', apiUrl);
        console.log('Request Method: POST');
        console.log('Request Headers:', {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        console.log('Request Body:', input);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(input),
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