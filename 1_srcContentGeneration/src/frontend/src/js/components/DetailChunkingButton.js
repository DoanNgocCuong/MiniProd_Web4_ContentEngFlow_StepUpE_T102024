import { config } from '../config.js';

export class DetailChunkingButton {
    constructor(scenario, question, containerId) {
        this.scenario = scenario;
        this.question = question;
        this.containerId = containerId;
        this.button = this._createButton();
    }

    _createButton() {
        const button = document.createElement('button');
        button.className = 'generate-detail-chunking-btn';
        button.textContent = 'Detail';
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
            const exercise = await this._generateDetailChunking();
            this._displayDetailChunking(exercise);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate detail');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Detail';
        }
    }

    async _generateDetailChunking() {
        const response = await fetch(`${config.production.apiUrl}/generate-questions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                generateQuestionInput: `Generate 1 English question about "${this.scenario}" based on this question: ${this.question}`
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.questions[0];
    }

    _displayDetailChunking(exercise) {
        const container = document.getElementById(this.containerId);
        container.innerHTML = `
            <div class="detail-chunking-container">
                <div class="detail-chunking-item">
                    <div class="question-section">
                        <div class="section-label">Question & Answer</div>
                        <div class="en-section">
                            <p class="question-text">${exercise.question}</p>
                            <p class="structure-text">${exercise.structure}</p>
                        </div>
                        <div class="vn-section">
                            <p class="question-text-vn">${exercise['question-vi']}</p>
                            <p class="structure-text-vn">${exercise['structure-vi']}</p>
                        </div>
                    </div>

                    <div class="phrases-section">
                        <div class="section-label">Answer Options</div>
                        <div class="phrase-group">
                            <div class="phrase main-phrase">
                                <div class="phrase-en">
                                    <span class="phrase-label">Main phrase:</span>
                                    <span class="phrase-text">${exercise['main phrase']}</span>
                                </div>
                                <div class="phrase-vn">
                                    <span class="phrase-text-vn">${exercise['main phrase-vi']}</span>
                                </div>
                            </div>

                            <div class="phrase option-1">
                                <div class="phrase-en">
                                    <span class="phrase-label">Option 1:</span>
                                    <span class="phrase-text">${exercise['optional phrase 1']}</span>
                                </div>
                                <div class="phrase-vn">
                                    <span class="phrase-text-vn">${exercise['optional phrase 1-vi']}</span>
                                </div>
                            </div>

                            <div class="phrase option-2">
                                <div class="phrase-en">
                                    <span class="phrase-label">Option 2:</span>
                                    <span class="phrase-text">${exercise['optional phrase 2']}</span>
                                </div>
                                <div class="phrase-vn">
                                    <span class="phrase-text-vn">${exercise['optional phrase 2-vi']}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    render() {
        return this.button;
    }
} 