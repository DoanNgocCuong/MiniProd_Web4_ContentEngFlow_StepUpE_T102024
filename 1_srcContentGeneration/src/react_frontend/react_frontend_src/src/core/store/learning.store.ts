import { create } from 'zustand';
import { LearningPathOutput } from '../../features/A_LearningPathGen/types/output';
import { TopicData, QuestionData } from '../../shared/types/common.types';

interface LearningState {
    // Output from A
    learningPath: LearningPathOutput | null;
    
    // Output from B1
    currentChunking: {
        questions: QuestionData[];
        topic: TopicData;
    } | null;
    
    // Navigation state
    currentWeek: number;
    currentTopic: TopicData | null;
    currentQuestion: QuestionData | null;

    // Actions
    setLearningPath: (path: LearningPathOutput) => void;
    setCurrentChunking: (chunking: { questions: QuestionData[]; topic: TopicData }) => void;
    setCurrentWeek: (week: number) => void;
    setCurrentTopic: (topic: TopicData) => void;
    setCurrentQuestion: (question: QuestionData) => void;
}

export const useLearningStore = create<LearningState>()((set) => ({
    learningPath: null,
    currentChunking: null,
    currentWeek: 1,
    currentTopic: null,
    currentQuestion: null,

    setLearningPath: (path: LearningPathOutput) => set({ learningPath: path }),
    setCurrentChunking: (chunking: { questions: QuestionData[]; topic: TopicData }) => 
        set({ currentChunking: chunking }),
    setCurrentWeek: (week: number) => set({ currentWeek: week }),
    setCurrentTopic: (topic: TopicData) => set({ currentTopic: topic }),
    setCurrentQuestion: (question: QuestionData) => set({ currentQuestion: question }),
})); 