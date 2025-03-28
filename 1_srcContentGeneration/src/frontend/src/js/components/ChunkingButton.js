import { config } from '../config.js';
import { DetailChunkingButton } from './DetailChunkingButton.js';

export class ChunkingButton {
    constructor(userProfile, weekData) {
        console.log('ChunkingButton constructor:', { userProfile, weekData });
        this.userProfile = userProfile;
        this.weekData = weekData;
        this.button = this._createButton();
    }

    _createButton() {
        const button = document.createElement('button');
        button.className = 'generate-chunking-btn';
        button.textContent = 'Generate Chunking';
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
            const questions = await this._generateQuestions();
            this._displayQuestions(questions);
        } catch (error) {
            console.error('Error generating questions:', error);
            alert('Failed to generate questions: ' + error.message);
        } finally {
            btn.disabled = false;
            btn.textContent = 'Generate Chunking';
        }
    }

    async _generateQuestions() {
        console.log('Generating questions with:', { 
            userProfile: this.userProfile,
            weekData: this.weekData 
        });

        const requestData = `USER PROFILE:
- Industry: ${this.userProfile.industry}
- Job: ${this.userProfile.job}
- English Level: ${this.userProfile.englishLevel}
- Learning Goals: ${this.userProfile.learningGoals}
---
{
      "week": ${this.weekData.week},
      "topic": "${this.weekData.topic}",
      "scenarios": ${JSON.stringify(this.weekData.scenarios)}
}`;

        const response = await fetch(`${config.production.apiUrl}/generate-20-chunking-from-5-scenario`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userProfile5Scenario: requestData
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return JSON.parse(data.chunkingPhrases);
    }

    _displayQuestions(questions) {
        const container = document.getElementById(`chunking-questions-week-${this.weekData.week}`);
        if (!container) {
            console.error(`Container for week ${this.weekData.week} not found`);
            return;
        }

        container.innerHTML = `
            <div class="questions-container">
                <h5>Speaking Practice Questions</h5>
                ${questions.scenarios.map(scenario => `
                    <div class="scenario-questions">
                        <h6>${scenario.scenario}</h6>
                        <ul>
                            ${scenario.questions.map((q, index) => `
                                <li class="question-item">
                                    <div class="question-content">
                                        <span>${q}</span>
                                        <div id="detail-btn-${scenario.scenario.replace(/\s+/g, '-')}-${index}" 
                                             class="detail-btn-container"></div>
                                    </div>
                                    <div id="detail-content-${scenario.scenario.replace(/\s+/g, '-')}-${index}" 
                                         class="detail-content"></div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        `;

        // Add Detail Chunking buttons for each question
        questions.scenarios.forEach(scenario => {
            scenario.questions.forEach((question, index) => {
                const btnContainer = document.getElementById(
                    `detail-btn-${scenario.scenario.replace(/\s+/g, '-')}-${index}`
                );
                const detailButton = new DetailChunkingButton(
                    scenario.scenario,
                    question,
                    `detail-content-${scenario.scenario.replace(/\s+/g, '-')}-${index}`
                );
                btnContainer.appendChild(detailButton.render());
            });
        });
    }

    render() {
        return this.button;
    }
}