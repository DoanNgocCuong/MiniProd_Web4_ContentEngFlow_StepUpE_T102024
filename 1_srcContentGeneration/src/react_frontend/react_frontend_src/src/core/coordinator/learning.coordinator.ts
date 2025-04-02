import { LearningPathOutput } from '../../features/A_LearningPathGen/types/output';
import { TopicData, QuestionData } from '../../shared/types/common.types';

export class LearningCoordinator {
    // A -> B1
    async selectWeekAndGenerateChunking(
        week: number,
        learningPath: LearningPathOutput
    ): Promise<{ questions: QuestionData[]; topic: TopicData }> {
        // TODO: Implement API call to generate chunking
        // This is a placeholder implementation
        return {
            questions: [],
            topic: {} as TopicData
        };
    }
    
    // B1 -> B2
    async selectQuestionAndGenerateDetail(
        question: QuestionData,
        chunking: { questions: QuestionData[]; topic: TopicData }
    ): Promise<any> {
        // TODO: Implement API call to generate detail
        // This is a placeholder implementation
        return {};
    }
    
    // B2 -> B3
    async generateExercisesFromDetail(
        detail: any
    ): Promise<any> {
        // TODO: Implement API call to generate exercises
        // This is a placeholder implementation
        return {};
    }
}

// Create a singleton instance
export const learningCoordinator = new LearningCoordinator(); 