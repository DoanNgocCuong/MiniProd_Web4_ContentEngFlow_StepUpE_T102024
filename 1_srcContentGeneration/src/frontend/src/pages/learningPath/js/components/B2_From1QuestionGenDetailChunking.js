import { config } from '../config.js';

export class From1QuestionGenDetailChunking {
    constructor(userProfile, scenario, question, containerId) {
        this.userProfile = userProfile;
        this.scenario = scenario;
        this.question = question;
        this.containerId = containerId;
        this.API_URL = config.production.apiUrl;
        this.button = this._createButton();
    }

    /**
     * Create generate detail button
     * @private
     */
    _createButton() {
        const button = document.createElement('button');
        button.className = 'generate-detail-btn';
        button.textContent = 'Generate Detail';
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
            console.log('Fetching detail for container:', this.containerId);
            const data = await this._fetchFromAPI();
            console.log('API response:', data);
            
            if (!data || !data.questions) {
                throw new Error('Invalid data format received');
            }
            
            console.log('Displaying detail in container:', this.containerId);
            this._displayDetail(data.questions[0]);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate detail: ' + error.message);
        } finally {
            btn.disabled = false;
            btn.textContent = 'Generate Detail';
        }
    }

    /**
     * Fetch detail from API
     * @private
     */
    async _fetchFromAPI() {
        try {
            // Create the request body with exact format from API docs
            const requestBody = {
                generateQuestionInput: `Generate detailed content for a specific question.`
                    + `\n# Prepare user profile\n`
                    + `user_profile = f"""USER PROFILE:\n${this.userProfile}"""\n\n`
                    + `# Prepare question data\n`
                    + `question_data = {\n`
                    + `    "topic": "${this.scenario}",\n`
                    + `    "scenario": "${this.scenario}",\n`
                    + `    "question": "${this.question}"\n`
                    + `}`
            };

            console.log('Request body:', requestBody); // For debugging

            const response = await fetch(`${this.API_URL}/generate-questions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
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

    /**
     * Display detail in the UI
     * @private
     */
    _displayDetail(detail) {
        console.log('Looking for container:', this.containerId);
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container ${this.containerId} not found`);
            return;
        }
        console.log('Container found, displaying detail:', detail);

        container.innerHTML = `
            <div class="detail-container">
                <div class="question-section">
                    <h6>Question (English)</h6>
                    <p>${detail.question}</p>
                    <h6>Question (Vietnamese)</h6>
                    <p>${detail['question-vi']}</p>
                </div>
                <div class="structure-section">
                    <h6>Structure (English)</h6>
                    <p>${detail.structure}</p>
                    <h6>Structure (Vietnamese)</h6>
                    <p>${detail['structure-vi']}</p>
                </div>
                <div class="phrases-section">
                    <h6>Main Phrase</h6>
                    <p>${detail['main phrase']} (${detail['main phrase-vi']})</p>
                    <h6>Alternative Phrases</h6>
                    <ul>
                        <li>${detail['optional phrase 1']} (${detail['optional phrase 1-vi']})</li>
                        <li>${detail['optional phrase 2']} (${detail['optional phrase 2-vi']})</li>
                    </ul>
                </div>
            </div>
        `;
    }

    /**
     * Render the button
     */
    render() {
        return this.button;
    }
}
