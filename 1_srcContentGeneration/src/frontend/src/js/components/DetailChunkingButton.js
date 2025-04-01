import { config } from '../config.js';
import { DataTable } from './DataTable.js';

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
        
        const headers = [
            'Question', 'Structure', 'Main Phrase',
            'Alternative Option 1', 'Alternative Option 2',
            'Question (VI)', 'Structure (VI)', 'Main Phrase (VI)',
            'Alternative Option 1 (VI)', 'Alternative Option 2 (VI)'
        ];

        const data = [{
            question: exercise.question,
            structure: exercise.structure,
            'main phrase': exercise['main phrase'],
            'optional phrase 1': exercise['optional phrase 1'],
            'optional phrase 2': exercise['optional phrase 2'],
            'question-vi': exercise['question-vi'],
            'structure-vi': exercise['structure-vi'],
            'main phrase-vi': exercise['main phrase-vi'],
            'optional phrase 1-vi': exercise['optional phrase 1-vi'],
            'optional phrase 2-vi': exercise['optional phrase 2-vi']
        }];

        const table = new DataTable(headers, data, {
            onEdit: (row) => this._openEditDialog(row),
            onDelete: () => container.innerHTML = ''
        });

        container.innerHTML = '';
        container.appendChild(table.render());
    }

    render() {
        return this.button;
    }
} 