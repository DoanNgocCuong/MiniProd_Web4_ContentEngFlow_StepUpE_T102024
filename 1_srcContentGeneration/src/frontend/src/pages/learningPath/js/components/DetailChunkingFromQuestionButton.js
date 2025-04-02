import { From1QuestionGenDetailChunking } from './B2_From1QuestionGenDetailChunking.js';

export class DetailChunkingFromQuestionButton {
    constructor(scenario, question, containerId) {
        this.scenario = scenario;
        this.question = question;
        this.containerId = containerId;
        this.button = this._createButton();
    }

    /**
     * Create detail button
     * @private
     */
    _createButton() {
        const button = document.createElement('button');
        button.className = 'detail-chunking-btn';
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
            // Get user profile from the form
            const formData = {
                industry: document.getElementById('industry')?.value || '',
                job: document.getElementById('job')?.value || '',
                englishLevel: document.getElementById('englishLevel')?.value || '',
                learningGoals: document.getElementById('learningGoals')?.value || ''
            };
            
            const userProfile = Object.entries(formData)
                .map(([key, value]) => `${key}: [${value}]`)
                .join('\n');

            // Create and use the detail generator
            const detailGenerator = new From1QuestionGenDetailChunking(
                userProfile,
                this.scenario,
                this.question,
                this.containerId
            );
            
            await detailGenerator._handleClick(e);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate detail: ' + error.message);
        } finally {
            btn.disabled = false;
            btn.textContent = 'Generate Detail';
        }
    }

    /**
     * Render the button
     */
    render() {
        return this.button;
    }
} 