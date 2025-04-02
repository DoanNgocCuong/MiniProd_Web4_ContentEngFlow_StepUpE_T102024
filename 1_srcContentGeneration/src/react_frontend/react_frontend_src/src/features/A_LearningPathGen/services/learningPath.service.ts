import { UserProfileInput } from '../types/input';
import { LearningPathOutput } from '../types/output';

export const generateLearningPath = async (
    input: UserProfileInput
): Promise<LearningPathOutput> => {
    try {
        // TODO: Replace with actual API call
        const response = await fetch('/api/generate-learning-path', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            throw new Error('Failed to generate learning path');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in generateLearningPath:', error);
        throw error;
    }
}; 