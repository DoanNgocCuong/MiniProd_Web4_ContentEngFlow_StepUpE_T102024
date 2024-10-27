import { UI } from './ui.js';
import { generateQuestions } from './api.js';

class App {
    constructor() {
        this.ui = new UI();
        this.initialize();
    }

    initialize() {
        this.ui.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { topic, level } = this.ui.getFormData();

        if (!topic) {
            this.ui.displayError('Please enter a topic');
            return;
        }

        try {
            this.ui.showLoading();
            const questions = await generateQuestions(topic, level);
            this.ui.displayQuestions(questions);
        } catch (error) {
            this.ui.displayError('Failed to generate questions. Please try again.');
        } finally {
            this.ui.hideLoading();
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new App();
});