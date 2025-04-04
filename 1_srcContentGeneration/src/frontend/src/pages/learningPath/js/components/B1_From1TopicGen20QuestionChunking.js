import { config } from '../config.js';
import { From1QuestionGenDetailChunking } from './B2_From1QuestionGenDetailChunking.js';

export class From1TopicGen20QuestionChunking {
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

    /**
     * Create generate questions button
     * @private
     */
    _createButton() {
        const button = document.createElement('button');
        button.className = 'generate-questions-btn';
        button.textContent = 'Generate Questions';
        button.addEventListener('click', async (e) => {
            await this._handleClick(e);
        });
        return button;
    }

    /**
     * Handle button click event
     * @private
     */
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

    /**
     * Fetch questions from API
     * @private
     */
    async _fetchFromAPI() {
        try {
            // Format userProfile according to API requirements
            const formattedUserProfile = this.userProfile.split('\n')
                .map(line => {
                    const [key, value] = line.split(':');
                    return `- ${key.trim()}: ${value ? value.trim() : 'undefined'}`;
                })
                .join('\n');

            // Create the request body with exact format from API docs
            const requestBody = {
                userProfile5Scenario: `USER PROFILE:\n${formattedUserProfile}\n---\n${JSON.stringify(this.weekData, null, 6)}`
            };

            console.log('Request body:', requestBody); // For debugging

            const response = await fetch(`${this.API_URL}/generate-20-chunking-from-5-scenario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return JSON.parse(data.chunkingPhrases);
        } catch (error) {
            throw new Error(`API request failed: ${error.message}`);
        }
    }

    /**
     * Display questions in the UI
     * @private
     */
    _displayQuestions(data) {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container for week ${this.weekNumber} not found`);
            return;
        }

        // Format userProfile for detail generation
        const formattedUserProfile = this.userProfile.split('\n')
            .map(line => {
                const [key, value] = line.split(':');
                return `- ${key.trim()}: ${value ? value.trim() : 'undefined'}`;
            })
            .join('\n');

        // Create HTML structure
        container.innerHTML = `
            <div class="questions-container">
                <h5 class="questions-title">Speaking Practice Questions</h5>
                ${data.scenarios.map(scenario => `
                    <div class="scenario-questions">
                        <h6 class="scenario-title">${scenario.scenario}</h6>
                        <ul class="questions-list">
                            ${scenario.questions.map((q, index) => {
                                const detailContainerId = `detail-content-${scenario.scenario.replace(/\s+/g, '-')}-${index}`;
                                return `
                                    <li class="question-item">
                                        <div class="question-content">
                                            <span class="question-text">${q}</span>
                                            <div id="detail-btn-${scenario.scenario.replace(/\s+/g, '-')}-${index}" 
                                                 class="detail-btn-container"></div>
                                        </div>
                                        <div class="detail-wrapper">
                                            <div id="${detailContainerId}" class="detail-content" style="display: block; min-height: 50px;"></div>
                                        </div>
                                    </li>
                                `;
                            }).join('')}
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
                const detailContainer = document.getElementById(
                    `detail-content-${scenario.scenario.replace(/\s+/g, '-')}-${index}`
                );
                
                if (btnContainer && detailContainer) {
                    console.log('Creating detail button for container:', detailContainer.id);
                    const detailButton = new From1QuestionGenDetailChunking(
                        formattedUserProfile,
                        scenario.scenario,
                        question,
                        detailContainer.id
                    );
                    btnContainer.appendChild(detailButton.render());
                } else {
                    console.error('Container not found:', {
                        btnContainer: `detail-btn-${scenario.scenario.replace(/\s+/g, '-')}-${index}`,
                        detailContainer: `detail-content-${scenario.scenario.replace(/\s+/g, '-')}-${index}`
                    });
                }
            });
        });
    }

    /**
     * Render the button
     */
    render() {
        return this.button;
    }
}
