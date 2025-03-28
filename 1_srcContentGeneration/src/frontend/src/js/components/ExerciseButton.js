import { config } from '../config.js';

export class ExerciseButton {
    constructor(scenario, questions) {
        this.scenario = scenario;    // Scenario hiện tại
        this.questions = questions;  // Các câu hỏi của scenario
        this.button = this._createButton();
    }

    _createButton() {
        const button = document.createElement('button');
        button.className = 'generate-exercise-btn';
        button.textContent = 'Generate Exercise';
        button.addEventListener('click', async (e) => {
            await this._handleClick(e);
        });
        return button;
    }

    async _handleClick(e) {
        const btn = e.target;
        btn.disabled = true;
        btn.textContent = 'Generating...';

        try {
            const exercises = await this._generateExercises();
            this._displayExercises(exercises);
        } catch (error) {
            console.error('Error generating exercises:', error);
            alert('Failed to generate exercises');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Generate Exercise';
        }
    }

    async _generateExercises() {
        // Format input cho generateQuestions API
        const generateQuestionInput = `Generate 1 English question about "${this.scenario}" focusing on these key points: ${this.questions.join(', ')}`;

        const response = await fetch(`${config.production.apiUrl}/generate-questions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                generateQuestionInput
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.questions;
    }

    _displayExercises(exercises) {
        const container = document.getElementById(`exercises-${this.scenario.replace(/\s+/g, '-')}`);
        container.innerHTML = `
            <div class="exercises-container">
                <h6>Practice Exercise</h6>
                ${exercises.map(exercise => `
                    <div class="exercise-item">
                        <p><strong>Question:</strong> ${exercise.question}</p>
                        <p><strong>Structure:</strong> ${exercise.structure}</p>
                        <div class="phrases">
                            <p><strong>Main phrase:</strong> ${exercise['main phrase']}</p>
                            <p><strong>Option 1:</strong> ${exercise['optional phrase 1']}</p>
                            <p><strong>Option 2:</strong> ${exercise['optional phrase 2']}</p>
                        </div>
                        <div class="translations">
                            <p><em>Question (VN):</em> ${exercise['question-vi']}</p>
                            <p><em>Structure (VN):</em> ${exercise['structure-vi']}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    render() {
        return this.button;
    }
} 