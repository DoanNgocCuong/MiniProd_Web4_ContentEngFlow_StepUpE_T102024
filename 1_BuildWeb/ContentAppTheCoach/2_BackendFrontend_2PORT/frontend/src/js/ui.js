export class UI {
    constructor() {
        this.generateBtn = document.getElementById('generate-btn');
        this.loadingDialog = document.getElementById('loading-dialog');
        this.questionContainer = document.getElementById('question-container');
    }

    showLoading() {
        this.loadingDialog.style.display = 'flex';
    }

    hideLoading() {
        this.loadingDialog.style.display = 'none';
    }

    displayQuestions(questions) {
        this.questionContainer.innerHTML = '';
        const questionsElement = document.createElement('div');
        questionsElement.className = 'questions-list';
        questionsElement.innerHTML = questions;
        this.questionContainer.appendChild(questionsElement);
    }

    displayError(message) {
        this.questionContainer.innerHTML = `
            <div class="error-message">
                ${message}
            </div>
        `;
    }

    getFormData() {
        return {
            topic: document.getElementById('topic').value,
            level: document.getElementById('level').value
        };
    }
}
