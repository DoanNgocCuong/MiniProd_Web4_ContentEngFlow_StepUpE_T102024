export interface WeekData {
    weekNumber: number;
    topics: TopicData[];
}

export interface TopicData {
    id: string;
    title: string;
    description: string;
    scenarios: ScenarioData[];
}

export interface ScenarioData {
    id: string;
    title: string;
    description: string;
}

export interface QuestionData {
    id: string;
    question: string;
    type: string;
}

export interface Translation {
    en: string;
    vi: string;
}

export interface Exercise {
    id: string;
    type: string;
    content: any;
    answer?: any;
} 