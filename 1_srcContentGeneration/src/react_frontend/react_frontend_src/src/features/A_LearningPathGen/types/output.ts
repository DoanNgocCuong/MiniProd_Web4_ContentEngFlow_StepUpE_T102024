import { WeekData, TopicData, ScenarioData } from '../../../shared/types/common.types';

export interface LearningPathOutput {
    weeks: WeekData[];     // 10 weeks
    topics: TopicData[];   // 10 topics
    scenarios: ScenarioData[]; // 50 scenarios
} 