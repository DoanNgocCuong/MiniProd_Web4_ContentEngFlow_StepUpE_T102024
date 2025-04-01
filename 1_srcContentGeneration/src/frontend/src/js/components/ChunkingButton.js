import { config } from '../config.js';
import { DetailChunkingButton } from './DetailChunkingButton.js';

export class ChunkingButton {
    constructor(userProfile, weekData) {
        console.log('ChunkingButton constructor:', { userProfile, weekData });
        this.userProfile = userProfile;
        this.weekData = weekData;
        this.button = this._createButton();
        
        // Display sample chunking data immediately
        this._displaySampleChunking();
    }

    _createButton() {
        const button = document.createElement('button');
        button.className = 'generate-chunking-btn';
        button.textContent = 'Generate Chunking';
        button.addEventListener('click', async (e) => {
            await this._handleClick(e);
        });
        return button;
    }

    _displaySampleChunking() {
        const container = document.getElementById(`chunking-questions-week-${this.weekData.week}`);
        if (!container) {
            console.error(`Container for week ${this.weekData.week} not found`);
            return;
        }

        // Sample chunking data
        const sampleChunking = {
            scenarios: this.weekData.scenarios.map(scenario => ({
                scenario: scenario.scenario,
                questions: [
                    "[Example Question 1] How would you open this discussion professionally?",
                    "[Example Question 2] What key information would you need to prepare?",
                    "[Example Question 3] How would you handle potential challenges?",
                    "[Example Question 4] What follow-up actions would you propose?"
                ]
            }))
        };

        container.innerHTML = `
            <div class="questions-container">
                <h5>[Example] Speaking Practice Questions</h5>
                ${sampleChunking.scenarios.map(scenario => `
                    <div class="scenario-questions">
                        <h6>${scenario.scenario}</h6>
                        <ul>
                            ${scenario.questions.map((q, index) => `
                                <li class="question-item">
                                    <div class="question-content">
                                        <span>${q}</span>
                                        <div id="detail-btn-${scenario.scenario.replace(/\s+/g, '-')}-${index}" 
                                             class="detail-btn-container">
                                             <button class="detail-btn">Show Example Details</button>
                                        </div>
                                    </div>
                                    <div id="detail-content-${scenario.scenario.replace(/\s+/g, '-')}-${index}" 
                                         class="detail-content">
                                         [Example Details] This is a sample response that would be replaced with actual chunking details from the API...
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        `;

        // Add click handlers for detail buttons
        container.querySelectorAll('.detail-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const content = e.target.closest('.question-item').querySelector('.detail-content');
                content.classList.toggle('active');
                e.target.textContent = content.classList.contains('active') ? 'Hide Example Details' : 'Show Example Details';
            });
        });
    }

    async _handleClick(e) {
        const btn = e.target;
        btn.disabled = true;
        btn.textContent = 'Generating...';

        try {
            // Example response data when clicking Generate Chunking
            const exampleResponse = {
                topic: "Daily standup (Họp đứng hàng ngày)",
                scenarios: [
                    {
                        scenario: "Chia sẻ tiến độ công việc",
                        questions: [
                            "Can you describe what you accomplished since our last meeting?",
                            "What tasks are you currently working on?",
                            "How do you feel about your progress this week?",
                            "What challenges have you faced in completing your tasks?"
                        ]
                    },
                    {
                        scenario: "Thảo luận vấn đề gặp phải",
                        questions: [
                            "What specific issues have you encountered recently?",
                            "How did these problems affect your work?",
                            "Can you share an example of a challenge you faced and how you handled it?",
                            "What support do you need from the team to overcome these obstacles?"
                        ]
                    },
                    {
                        scenario: "Đề xuất giải pháp cải tiến",
                        questions: [
                            "What improvements do you think could enhance our workflow?",
                            "Can you suggest a new tool or process that might help us?",
                            "How would you implement your proposed solution?",
                            "What benefits do you foresee from making these changes?"
                        ]
                    },
                    {
                        scenario: "Phân công nhiệm vụ mới",
                        questions: [
                            "What new tasks do you think we should prioritize?",
                            "How do you feel about taking on additional responsibilities?",
                            "Can you outline the steps you would take to complete your new assignment?",
                            "What skills do you think are necessary for the new tasks?"
                        ]
                    },
                    {
                        scenario: "Lên kế hoạch cho ngày tiếp theo",
                        questions: [
                            "What are your main goals for tomorrow?",
                            "How do you plan to tackle your tasks for the day?",
                            "What do you need to accomplish by the end of the day?",
                            "Can you share your strategy for managing your time effectively tomorrow?"
                        ]
                    }
                ]
            };

            // Display the example response
            this._displayQuestions(exampleResponse);

        } catch (error) {
            console.error('Error generating questions:', error);
            alert('Failed to generate questions: ' + error.message);
        } finally {
            btn.disabled = false;
            btn.textContent = 'Generate Chunking';
        }
    }

    _displayQuestions(questions) {
        const container = document.getElementById(`chunking-questions-week-${this.weekData.week}`);
        if (!container) {
            console.error(`Container for week ${this.weekData.week} not found`);
            return;
        }

        container.innerHTML = `
            <div class="questions-container">
                <h5>${questions.topic}</h5>
                ${questions.scenarios.map(scenario => `
                    <div class="scenario-questions">
                        <h6>${scenario.scenario}</h6>
                        <ul>
                            ${scenario.questions.map((q, index) => `
                                <li class="question-item">
                                    <div class="question-content">
                                        <span>${q}</span>
                                        <div id="detail-btn-${scenario.scenario.replace(/\s+/g, '-')}-${index}" 
                                             class="detail-btn-container">
                                             <button class="detail-btn">Show Details</button>
                                        </div>
                                    </div>
                                    <div id="detail-content-${scenario.scenario.replace(/\s+/g, '-')}-${index}" 
                                         class="detail-content">
                                         <div class="chunking-details">
                                             <p><strong>Key Vocabulary:</strong></p>
                                             <ul>
                                                 <li>accomplish (v): hoàn thành</li>
                                                 <li>progress (n): tiến độ</li>
                                                 <li>challenge (n): thách thức</li>
                                                 <li>task (n): nhiệm vụ</li>
                                             </ul>
                                             <p><strong>Sample Response:</strong></p>
                                             <p>"Since our last meeting, I have accomplished several key tasks. First, I completed the database optimization which improved query performance by 30%. I'm currently working on implementing the new authentication system. I feel positive about my progress this week as I've met all my deadlines. However, I faced some challenges with the API integration that required additional research and testing."</p>
                                             <p><strong>Useful Phrases:</strong></p>
                                             <ul>
                                                 <li>"I have accomplished..."</li>
                                                 <li>"I'm currently working on..."</li>
                                                 <li>"Regarding my progress..."</li>
                                                 <li>"The main challenge was..."</li>
                                             </ul>
                                         </div>
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        `;

        // Add click handlers for detail buttons
        container.querySelectorAll('.detail-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const content = e.target.closest('.question-item').querySelector('.detail-content');
                content.classList.toggle('active');
                e.target.textContent = content.classList.contains('active') ? 'Hide Details' : 'Show Details';
            });
        });
    }

    render() {
        return this.button;
    }
}