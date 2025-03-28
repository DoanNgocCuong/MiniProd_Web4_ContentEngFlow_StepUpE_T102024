import { generateLearningCard } from '../modules/learningCard.js';
import { generateLearningFlexible } from '../modules/learningFlexible.js';
import { generateLearningMeaning } from '../modules/learningMeaning.js';
import { generateLearningQNA } from '../modules/learningQNA.js';

export class MiniExerciseButton {
    constructor(containerId, lessons) {
        this.containerId = containerId;
        this.lessons = lessons;
        this.button = this._createButton();
        this.resultContainer = this._createResultContainer();
    }

    _createButton() {
        const button = document.createElement('button');
        button.textContent = 'Mini Generate Exercise';
        button.className = 'mini-exercise-btn';
        button.addEventListener('click', () => this._handleClick());
        return button;
    }

    _createResultContainer() {
        const container = document.createElement('div');
        container.className = 'mini-exercise-results';
        container.innerHTML = `
            <div id="${this.containerId}-card" class="exercise-section"></div>
            <div id="${this.containerId}-flexible" class="exercise-section"></div>
            <div id="${this.containerId}-meaning" class="exercise-section"></div>
            <div id="${this.containerId}-qna" class="exercise-section"></div>
        `;
        return container;
    }

    async _handleClick() {
        try {
            // Hiển thị container kết quả ngay dưới nút
            const parentContainer = document.getElementById(this.containerId);
            const buttonIndex = Array.from(parentContainer.children).indexOf(this.button);
            parentContainer.insertBefore(this.resultContainer, parentContainer.children[buttonIndex + 1]);

            // Gọi song song 4 hàm generate với container ID tương ứng
            await Promise.all([
                this._generateCardExercise(),
                this._generateFlexibleExercise(),
                this._generateMeaningExercise(),
                this._generateQNAExercise()
            ]);

        } catch (error) {
            console.error('Error generating exercises:', error);
            alert('Error generating exercises: ' + error.message);
        }
    }

    async _generateCardExercise() {
        // Override container ID để hiển thị kết quả đúng vị trí
        const originalContainer = document.getElementById('learning-card-container');
        const tempContainer = document.getElementById(`${this.containerId}-card`);
        if (tempContainer) {
            tempContainer.innerHTML = '<h4>Learning Card Exercise</h4>';
            document.getElementById('learning-card-container') = tempContainer;
            await generateLearningCard(this.lessons);
            document.getElementById('learning-card-container') = originalContainer;
        }
    }

    async _generateFlexibleExercise() {
        const originalContainer = document.getElementById('learning-flexible-container');
        const tempContainer = document.getElementById(`${this.containerId}-flexible`);
        if (tempContainer) {
            tempContainer.innerHTML = '<h4>Learning Flexible Exercise</h4>';
            document.getElementById('learning-flexible-container') = tempContainer;
            await generateLearningFlexible(this.lessons);
            document.getElementById('learning-flexible-container') = originalContainer;
        }
    }

    async _generateMeaningExercise() {
        const originalContainer = document.getElementById('learning-meaning-container');
        const tempContainer = document.getElementById(`${this.containerId}-meaning`);
        if (tempContainer) {
            tempContainer.innerHTML = '<h4>Learning Meaning Exercise</h4>';
            document.getElementById('learning-meaning-container') = tempContainer;
            await generateLearningMeaning(this.lessons);
            document.getElementById('learning-meaning-container') = originalContainer;
        }
    }

    async _generateQNAExercise() {
        const originalContainer = document.getElementById('learning-qna-container');
        const tempContainer = document.getElementById(`${this.containerId}-qna`);
        if (tempContainer) {
            tempContainer.innerHTML = '<h4>Learning QNA Exercise</h4>';
            document.getElementById('learning-qna-container') = tempContainer;
            await generateLearningQNA(this.lessons);
            document.getElementById('learning-qna-container') = originalContainer;
        }
    }

    render() {
        return this.button;
    }
} 