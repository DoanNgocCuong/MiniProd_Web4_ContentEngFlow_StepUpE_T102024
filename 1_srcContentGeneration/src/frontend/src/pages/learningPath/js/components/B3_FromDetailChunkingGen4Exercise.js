import { config } from '../config.js';

export class FromDetailChunkingGen4Exercise {
    constructor(detail) {
        this.detail = detail;
        this.API_URL = config.production.apiUrl;
        this.exerciseTypes = [
            { 
                id: 'learning-meaning', 
                name: 'Learning Meaning',
                api: '/generate-learning-meaning',
                icon: '📚'
            },
            { 
                id: 'learning-card', 
                name: 'Learning Card',
                api: '/generate-learning-card',
                icon: '🎴'
            },
            { 
                id: 'learning-flexible', 
                name: 'Flexible Phrase',
                api: '/generate-learning-flexible',
                icon: '🔄'
            },
            { 
                id: 'learning-qna', 
                name: 'Q&A Exercise',
                api: '/generate-learning-qna',
                icon: '❓'
            }
        ];
        this.currentExercise = null;
    }

    /**
     * Create exercise container with buttons
     */
    render() {
        console.log('=== START RENDER EXERCISE BUTTONS ===');
        
        // Create main container with proper positioning
        const container = document.createElement('div');
        container.className = 'exercise-wrapper';
        container.style.cssText = `
            position: relative;
            margin-top: 1rem;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e9ecef;
            z-index: 100;
            transition: all 0.3s ease;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            height: auto !important;
            overflow: visible !important;
        `;

        // Create Generate Exercise button with proper styling
        const generateBtn = document.createElement('button');
        generateBtn.className = 'generate-exercise-btn';
        generateBtn.style.cssText = `
            width: 100%;
            padding: 0.75rem;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 0.9rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            margin-bottom: 1rem;
        `;
        generateBtn.innerHTML = `
            <span style="font-size: 1.2rem;">🎯</span>
            <span>Generate Exercise</span>
        `;

        // Add hover effect with ripple
        generateBtn.addEventListener('mouseover', (e) => {
            generateBtn.style.background = '#0056b3';
            generateBtn.style.transform = 'translateY(-1px)';
            generateBtn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = generateBtn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            
            generateBtn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });

        generateBtn.addEventListener('mouseout', () => {
            generateBtn.style.background = '#007bff';
            generateBtn.style.transform = 'none';
            generateBtn.style.boxShadow = 'none';
        });

        // Create exercise buttons container with proper animation
        const exerciseContainer = document.createElement('div');
        exerciseContainer.className = 'exercise-buttons-container';
        exerciseContainer.style.cssText = `
            display: none;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #e9ecef;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
            position: relative;
            z-index: 101;
        `;

        // Create header with proper styling
        const header = document.createElement('div');
        header.className = 'exercise-header';
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #eee;
            position: relative;
            z-index: 102;
        `;

        const title = document.createElement('h4');
        title.className = 'exercise-title';
        title.textContent = 'Choose Exercise Type';
        title.style.cssText = `
            margin: 0;
            font-size: 1.1rem;
            color: #333;
            font-weight: 600;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.className = 'exercise-close-btn';
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.25rem 0.5rem;
            color: #666;
            line-height: 1;
            transition: all 0.2s ease;
            position: relative;
            z-index: 103;
        `;

        // Add hover effect to close button
        closeBtn.addEventListener('mouseover', () => {
            closeBtn.style.color = '#dc3545';
            closeBtn.style.transform = 'rotate(90deg)';
        });
        closeBtn.addEventListener('mouseout', () => {
            closeBtn.style.color = '#666';
            closeBtn.style.transform = 'none';
        });

        closeBtn.onclick = () => {
            exerciseContainer.style.opacity = '0';
            exerciseContainer.style.transform = 'translateY(10px)';
            setTimeout(() => {
                exerciseContainer.style.display = 'none';
                generateBtn.style.display = 'flex';
            }, 300);
        };

        header.appendChild(title);
        header.appendChild(closeBtn);
        exerciseContainer.appendChild(header);

        // Create buttons grid with proper styling
        const buttonsGrid = document.createElement('div');
        buttonsGrid.className = 'exercise-buttons-grid';
        buttonsGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 0.75rem;
            margin-bottom: 1rem;
            position: relative;
            z-index: 104;
        `;

        // Create buttons for each exercise type
        this.exerciseTypes.forEach(type => {
            const button = this._createExerciseButton(type);
            buttonsGrid.appendChild(button);
        });

        exerciseContainer.appendChild(buttonsGrid);

        // Create exercise display area with proper styling
        const exerciseDisplay = document.createElement('div');
        exerciseDisplay.className = 'exercise-display';
        exerciseDisplay.id = 'exercise-display';
        exerciseDisplay.style.cssText = `
            width: 100%;
            margin-top: 1rem;
            padding: 1rem;
            background: white;
            border-radius: 8px;
            border: 1px solid #e9ecef;
            min-height: 100px;
            display: none;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
            position: relative;
            z-index: 105;
        `;
        exerciseContainer.appendChild(exerciseDisplay);

        // Add click handler for generate button with animation
        generateBtn.addEventListener('click', () => {
            generateBtn.style.display = 'none';
            exerciseContainer.style.display = 'block';
            // Force reflow
            exerciseContainer.offsetHeight;
            exerciseContainer.style.opacity = '1';
            exerciseContainer.style.transform = 'translateY(0)';
        });

        // Add containers to main container
        container.appendChild(generateBtn);
        container.appendChild(exerciseContainer);

        // Add keyframe animation for ripple effect
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        console.log('=== END RENDER EXERCISE BUTTONS ===');
        return container;
    }

    /**
     * Create button for each exercise type
     * @private
     */
    _createExerciseButton(type) {
        const button = document.createElement('button');
        button.className = `exercise-btn ${type.id}-btn`;
        button.style.cssText = `
            padding: 0.75rem;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            background: white;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.2s ease;
        `;
        button.innerHTML = `
            <span class="btn-icon" style="font-size: 1.5rem;">${type.icon}</span>
            <span class="btn-text" style="font-size: 0.85rem; color: #495057;">${type.name}</span>
        `;
        button.addEventListener('mouseover', () => {
            button.style.borderColor = '#007bff';
            button.style.transform = 'translateY(-1px)';
            button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        });
        button.addEventListener('mouseout', () => {
            button.style.borderColor = '#e9ecef';
            button.style.transform = 'none';
            button.style.boxShadow = 'none';
        });
        button.addEventListener('click', async (e) => {
            await this._handleExerciseClick(e, type);
        });
        return button;
    }

    /**
     * Handle exercise button click
     * @private
     */
    async _handleExerciseClick(e, type) {
        const btn = e.target.closest('.exercise-btn');
        const display = document.getElementById('exercise-display');
        
        // Disable all buttons while generating
        document.querySelectorAll('.exercise-btn').forEach(b => b.disabled = true);
        btn.textContent = 'Generating...';
        display.innerHTML = '<div class="loading">Generating exercise...</div>';

        try {
            const exercise = await this._fetchExercise(type);
            this.currentExercise = exercise;
            this._displayExercise(exercise, type);
            this._setupExerciseHandlers(type);
        } catch (error) {
            console.error('Error generating exercise:', error);
            display.innerHTML = `<div class="error">Failed to generate exercise: ${error.message}</div>`;
        } finally {
            // Re-enable all buttons
            document.querySelectorAll('.exercise-btn').forEach(b => b.disabled = false);
            btn.innerHTML = `
                <span class="btn-icon">${type.icon}</span>
                <span class="btn-text">${type.name}</span>
            `;
        }
    }

    /**
     * Setup event handlers for exercise
     * @private
     */
    _setupExerciseHandlers(type) {
        const checkBtn = document.querySelector('.check-answer-btn');
        if (checkBtn) {
            checkBtn.addEventListener('click', () => this._checkAnswer(type));
        }

        if (type.id === 'learning-meaning') {
            this._setupLearningMeaningHandlers();
        }
    }

    /**
     * Setup drag and drop handlers for learning meaning exercise
     * @private
     */
    _setupLearningMeaningHandlers() {
        const options = document.querySelectorAll('.learning-meaning .option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                const selectedOption = option.querySelector('input[type="radio"]');
                if (selectedOption.checked) {
                    this._checkAnswer(this.currentExercise.type);
                }
            });
        });
    }

    /**
     * Check answer for current exercise
     * @private
     */
    _checkAnswer(type) {
        const feedback = document.querySelector('.feedback');
        let isCorrect = false;
        let message = '';

        switch (type.id) {
            case 'learning-meaning':
                const selectedMeaning = document.querySelector('input[name="answer"]:checked');
                isCorrect = selectedMeaning && selectedMeaning.value === this.currentExercise.correctAnswer.toString();
                message = isCorrect ? 'Correct! Well done!' : 'Try again!';
                break;

            case 'learning-card':
                // Implement learning card answer checking logic
                message = 'Learning card answer checking logic not implemented yet.';
                break;

            case 'learning-flexible':
                // Implement flexible phrase answer checking logic
                message = 'Flexible phrase answer checking logic not implemented yet.';
                break;

            case 'learning-qna':
                // Implement Q&A answer checking logic
                message = 'Q&A answer checking logic not implemented yet.';
                break;
        }

        feedback.innerHTML = `
            <div class="feedback-message ${isCorrect ? 'correct' : 'incorrect'}">
                ${message}
            </div>
        `;
    }

    /**
     * Fetch exercise from API
     * @private
     */
    async _fetchExercise(type) {
        try {
            const requestBody = {
                question: this.detail.question,
                structure: this.detail.structure,
                "main phrase": this.detail['main phrase'],
                "optional phrase 1": this.detail['optional phrase 1'],
                "optional phrase 2": this.detail['optional phrase 2'],
                "question-vi": this.detail['question-vi'],
                "structure-vi": this.detail['structure-vi'],
                "main phrase-vi": this.detail['main phrase-vi'],
                "optional phrase 1-vi": this.detail['optional phrase 1-vi'],
                "optional phrase 2-vi": this.detail['optional phrase 2-vi'],
                lesson_id: "oke_1919_02042025" // This should be dynamic based on your needs
            };

            const response = await fetch(`${this.API_URL}${type.api}`, {
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
     * Display generated exercise
     * @private
     */
    _displayExercise(exercise, type) {
        console.log('=== START DISPLAY EXERCISE ===');
        const display = document.getElementById('exercise-display');
        let exerciseHtml = '';

        switch (type.id) {
            case 'learning-meaning':
                exerciseHtml = this._createLearningMeaningExercise(exercise);
                break;
            case 'learning-card':
                exerciseHtml = this._createLearningCardExercise(exercise);
                break;
            case 'learning-flexible':
                exerciseHtml = this._createFlexiblePhraseExercise(exercise);
                break;
            case 'learning-qna':
                exerciseHtml = this._createQnAExercise(exercise);
                break;
        }

        display.innerHTML = exerciseHtml;
        display.style.display = 'block';
        display.style.visibility = 'visible';
        display.style.opacity = '1';

        // Force reflow
        display.offsetHeight;

        console.log('=== END DISPLAY EXERCISE ===');
    }

    /**
     * Create Learning Meaning exercise HTML
     * @private
     */
    _createLearningMeaningExercise(exercise) {
        return `
            <div class="exercise-content">
                <table class="exercise-table">
                    <tr>
                        <th>Sentence</th>
                        <td>${exercise.exercises[0].sentence}</td>
                    </tr>
                    <tr>
                        <th>Answer 1</th>
                        <td>${exercise.exercises[0].answer_1}</td>
                    </tr>
                    <tr>
                        <th>Answer 2</th>
                        <td>${exercise.exercises[0].answer_2}</td>
                    </tr>
                    <tr>
                        <th>Answer 3</th>
                        <td>${exercise.exercises[0].answer_3}</td>
                    </tr>
                </table>
            </div>
        `;
    }

    /**
     * Create Learning Card exercise HTML
     * @private
     */
    _createLearningCardExercise(exercise) {
        return `
            <div class="exercise-content">
                <table class="exercise-table">
                    <thead>
                        <tr>
                            <th>English</th>
                            <th>Vietnamese</th>
                            <th>IPA</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${exercise.exercises.map(ex => `
                            <tr>
                                <td>${ex.sentence_en}</td>
                                <td>${ex.sentence_vi}</td>
                                <td>${ex.ipa}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    /**
     * Create Flexible Phrase exercise HTML
     * @private
     */
    _createFlexiblePhraseExercise(exercise) {
        return `
            <div class="exercise-content">
                <table class="exercise-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>English</th>
                            <th>Vietnamese</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${exercise.exercises.map(ex => `
                            <tr>
                                <td>${ex.description}</td>
                                <td>${ex.sentence_en}</td>
                                <td>${ex.sentence_vi}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    /**
     * Create Q&A exercise HTML
     * @private
     */
    _createQnAExercise(exercise) {
        return `
            <div class="exercise-content">
                <table class="exercise-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>English</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${exercise.map(ex => `
                            <tr>
                                <td>${ex.description}</td>
                                <td>${ex.sentence_en}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
}
