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
        console.log('=== START DISPLAY DETAIL ===');
        console.log('1. Looking for container:', this.containerId);
        const container = document.getElementById(this.containerId);
        
        if (!container) {
            console.error('Container not found:', this.containerId);
            return;
        }
        
        console.log('2. Container found:', {
            id: container.id,
            className: container.className,
            parentElement: container.parentElement.tagName,
            parentClass: container.parentElement.className,
            visibility: window.getComputedStyle(container).visibility,
            display: window.getComputedStyle(container).display,
            zIndex: window.getComputedStyle(container).zIndex,
            position: window.getComputedStyle(container).position
        });

        // Create detail HTML using the correct CSS classes
        const detailHtml = `
            <div class="detail-chunking-container">
                <div class="detail-chunking-item">
                    <div class="question-section">
                        <div class="en-section">
                            <div class="section-label">Question (English)</div>
                            <div class="question-text">${detail.question}</div>
                        </div>
                        <div class="vn-section">
                            <div class="section-label">Question (Vietnamese)</div>
                            <div class="question-text-vn">${detail['question-vi']}</div>
                        </div>
                    </div>

                    <div class="question-section">
                        <div class="en-section">
                            <div class="section-label">Structure (English)</div>
                            <div class="structure-text">${detail.structure}</div>
                        </div>
                        <div class="vn-section">
                            <div class="section-label">Structure (Vietnamese)</div>
                            <div class="structure-text-vn">${detail['structure-vi']}</div>
                        </div>
                    </div>

                    <div class="phrases-section">
                        <div class="section-label">Phrases</div>
                        <div class="phrase-group">
                            <div class="phrase main-phrase">
                                <div class="phrase-en">
                                    <span class="phrase-label">Main:</span>
                                    <span class="phrase-text">${detail['main phrase']}</span>
                                </div>
                                <div class="phrase-text-vn">${detail['main phrase-vi']}</div>
                            </div>
                            <div class="phrase">
                                <div class="phrase-en">
                                    <span class="phrase-label">Optional 1:</span>
                                    <span class="phrase-text">${detail['optional phrase 1']}</span>
                                </div>
                                <div class="phrase-text-vn">${detail['optional phrase 1-vi']}</div>
                            </div>
                            <div class="phrase">
                                <div class="phrase-en">
                                    <span class="phrase-label">Optional 2:</span>
                                    <span class="phrase-text">${detail['optional phrase 2']}</span>
                                </div>
                                <div class="phrase-text-vn">${detail['optional phrase 2-vi']}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Clear previous content and add new content
        console.log('3. Current container content:', container.innerHTML);
        container.innerHTML = detailHtml;
        
        // Verify content was added
        console.log('4. New container content length:', container.innerHTML.length);
        console.log('5. Container dimensions:', {
            offsetHeight: container.offsetHeight,
            clientHeight: container.clientHeight,
            scrollHeight: container.scrollHeight,
            offsetWidth: container.offsetWidth
        });
        
        // Check if any parent elements might be hiding the content
        let parent = container.parentElement;
        let parentPath = [];
        while (parent && parent !== document.body) {
            parentPath.push({
                tag: parent.tagName,
                class: parent.className,
                display: window.getComputedStyle(parent).display,
                visibility: window.getComputedStyle(parent).visibility,
                height: window.getComputedStyle(parent).height,
                overflow: window.getComputedStyle(parent).overflow
            });
            parent = parent.parentElement;
        }
        console.log('6. Parent elements:', parentPath);
        console.log('=== END DISPLAY DETAIL ===');
    }

    /**
     * Render the button
     */
    render() {
        return this.button;
    }
}
