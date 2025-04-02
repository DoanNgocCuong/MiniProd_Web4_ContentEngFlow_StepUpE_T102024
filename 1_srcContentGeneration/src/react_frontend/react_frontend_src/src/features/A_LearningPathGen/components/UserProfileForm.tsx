import React, { useState } from 'react';
import { UserProfileInput } from '../types/input';
import { generateLearningPath } from '../services/learningPath.service';
import { useLearningStore } from '../../../core/store/learning.store';

const INDUSTRIES = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Other'
];

const ENGLISH_LEVELS = [
    'Beginner',
    'Elementary',
    'Intermediate',
    'Upper Intermediate',
    'Advanced'
];

const LEARNING_GOALS = [
    'Professional Communication',
    'Technical Writing',
    'Business Meetings',
    'Email Writing',
    'Presentation Skills',
    'Interview Preparation'
];

export const UserProfileForm: React.FC = () => {
    const [formData, setFormData] = useState<UserProfileInput>({
        industry: '',
        job: '',
        englishLevel: '',
        learningGoals: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const setLearningPath = useLearningStore(state => state.setLearningPath);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            learningGoals: checked
                ? [...prev.learningGoals, value]
                : prev.learningGoals.filter(goal => goal !== value)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const learningPath = await generateLearningPath(formData);
            setLearningPath(learningPath);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate learning path');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="user-profile-form">
            <h2>Create Your Learning Path</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="industry">Industry:</label>
                    <select
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Industry</option>
                        {INDUSTRIES.map(industry => (
                            <option key={industry} value={industry}>
                                {industry}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="job">Job Title:</label>
                    <input
                        type="text"
                        id="job"
                        name="job"
                        value={formData.job}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Software Developer"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="englishLevel">English Level:</label>
                    <select
                        id="englishLevel"
                        name="englishLevel"
                        value={formData.englishLevel}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select English Level</option>
                        {ENGLISH_LEVELS.map(level => (
                            <option key={level} value={level}>
                                {level}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Learning Goals:</label>
                    <div className="checkbox-group">
                        {LEARNING_GOALS.map(goal => (
                            <label key={goal} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    value={goal}
                                    checked={formData.learningGoals.includes(goal)}
                                    onChange={handleCheckboxChange}
                                />
                                {goal}
                            </label>
                        ))}
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Generate Learning Path'}
                </button>
            </form>
        </div>
    );
}; 