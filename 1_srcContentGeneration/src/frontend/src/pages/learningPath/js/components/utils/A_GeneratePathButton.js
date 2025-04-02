import { config } from '../config.js';
import { DetailChunkingFromQuestionButton } from './DetailChunkingFromQuestionButton.js';

export class GenerateQuestionFromTopicAndScenarioButton {
    constructor(userProfile, weekData) {
        this.userProfile = userProfile;
        this.weekData = weekData;
        this.API_URL = config.production.apiUrl;
        
        // Handle example data case
        if (weekData.topic && weekData.topic.includes('[Example')) {
            // Extract week number from example topic
            const weekMatch = weekData.topic.match(/Week (\d+)/);
            this.weekNumber = weekMatch ? weekMatch[1] : '1';
        } else {
            this.weekNumber = weekData.week || '1';
        }
        
        this.containerId = `chunking-questions-week-${this.weekNumber}`;
        this.button = this._createButton();
    }

    _createButton() {
        const button = document.createElement('button');
        button.className = 'generate-questions-btn';
        button.textContent = 'Generate Questions';
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
            const data = await this._fetchFromAPI();
            if (!data || !data.scenarios) {
                throw new Error('Invalid data format received');
            }
            
            this._displayQuestions(data);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate questions: ' + error.message);
        } finally {
            btn.disabled = false;
            btn.textContent = 'Generate Questions';
        }
    }

    async _fetchFromAPI() {
        try {
            const response = await fetch(`${this.API_URL}/generate-questions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userProfile: this.userProfile,
                    weekData: this.weekData
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw new Error(`API request failed: ${error.message}`);
        }
    }

    _displayQuestions(data) {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container for week ${this.weekNumber} not found`);
            return;
        }

        container.innerHTML = `
            <div class="questions-container">
                <h5>Speaking Practice Questions</h5>
                ${data.scenarios.map(scenario => `
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
        data.scenarios.forEach(scenario => {
            scenario.questions.forEach((question, index) => {
                const btnContainer = document.getElementById(
                    `detail-btn-${scenario.scenario.replace(/\s+/g, '-')}-${index}`
                );
                if (btnContainer) {
                    const detailButton = new DetailChunkingFromQuestionButton(
                        scenario.scenario,
                        question,
                        `detail-content-${scenario.scenario.replace(/\s+/g, '-')}-${index}`
                    );
                    btnContainer.appendChild(detailButton.render());
                }
            });
        });
    }

    render() {
        return this.button;
    }
} 