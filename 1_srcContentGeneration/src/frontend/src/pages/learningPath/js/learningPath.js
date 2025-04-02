// Import các dependencies
import { config, currentConfig } from './config.js';
import { showLoadingDialog, hideLoadingDialog, updateLoadingProgress } from './utils.js';
import learningCache from './components/modules/cache.js';
import { GenerateQuestionFromTopicAndScenarioButton } from './components/GenerateQuestionFromTopicAndScenarioButton.js';
import { DetailChunkingFromQuestionButton } from './components/DetailChunkingFromQuestionButton.js';
import sampleLearningPath from './data/sampleLearningPath.json';

// Cấu trúc Class: Chia thành 2 class chính:
// LearningPathManager: Xử lý logic nghiệp vụ
// LearningPathRenderer: Xử lý việc hiển thị
// Private Methods: Sử dụng prefix _ cho private methods
// Error Handling: Cải thiện xử lý lỗi với try-catch
// Documentation: Thêm JSDoc cho các methods
// Single Responsibility: Mỗi method chỉ làm một nhiệm vụ cụ thể
// Dependency Injection: Dễ dàng thay đổi các dependencies
// Caching: Tối ưu việc sử dụng cache
// Clean Code: Code dễ đọc và maintain hơn

/**
 * Class quản lý toàn bộ Learning Path
 */
class LearningPathManager {
    constructor() {
        console.log('LearningPathManager initialized');
        this.API_URL = config.production.apiUrl;
        this.cache = learningCache;
        this.data = null;
        this.userProfile = null;
        
        // Load sample data immediately
        this._loadSampleData();

        // Thêm event listener cho button click
        const generateButton = document.getElementById('generate-path-btn');
        if (generateButton) {
            console.log('Adding click listener to generate button');
            // Thêm event listener trực tiếp
            generateButton.onclick = async () => {
                console.log('Button clicked');
                await this._handleFormSubmit();
            };
        } else {
            console.error('Generate button not found');
        }
    }

    _loadSampleData() {
        this.data = {
            ...sampleLearningPath
        };
        this._displayResults();
    }

    /**
     * Khởi tạo Learning Path từ user profile
     * @param {string} userProfile - Thông tin profile của user
     */
    async generatePath(userProfile) {
        console.log('generatePath called with:', userProfile);
        try {
            this.userProfile = userProfile;
            await this._processLearningPath(userProfile);
        } catch (error) {
            console.error('Learning Path Error:', error);
            throw error;
        }
    }

    /**
     * Xử lý việc tạo learning path
     * @private
     */
    async _processLearningPath(userProfile) {
        try {
            // Kiểm tra cache
            const cachedData = this.cache.get('path', userProfile);
            if (cachedData) {
                console.log('Found cached data');
                this.data = {
                    ...cachedData,
                    user_id: userProfile
                };
                return this._displayResults();
            }

            console.log('No cache found, calling API...');
            showLoadingDialog();
            updateLoadingProgress(10);
            
            const data = await this._fetchFromAPI(userProfile);
            this.data = {
                ...JSON.parse(data.learningPath),
                user_id: userProfile
            };

            // Lưu vào cache
            this.cache.set('path', data, userProfile);
            
            await this._displayResults();
            updateLoadingProgress(100);

        } catch (error) {
            console.error('Process error:', error);
            throw new Error(`Failed to process learning path: ${error.message}`);
        } finally {
            hideLoadingDialog();
        }
    }

    /**
     * Gọi API để lấy learning path
     * @private
     */
    async _fetchFromAPI(userProfile) {
        try {
            const response = await fetch(`${this.API_URL}/generate-learning-path`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userProfile })
            });

            updateLoadingProgress(70);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            updateLoadingProgress(90);
            return data;

        } catch (error) {
            throw new Error(`API request failed: ${error.message}`);
        }
    }

    /**
     * Hiển thị kết quả learning path
     * @private
     */
    async _displayResults() {
        const renderer = new LearningPathRenderer();
        await renderer.render(this.data, this.userProfile);
    }

    // Tách logic xử lý form submit thành method riêng
    async _handleFormSubmit() {
        console.log('Form submitted');
        
        const formData = {
            industry: document.getElementById('industry')?.value || '',
            job: document.getElementById('job')?.value || '',
            englishLevel: document.getElementById('englishLevel')?.value || '',
            learningGoals: document.getElementById('learningGoals')?.value || ''
        };
        
        console.log('Form data:', formData);
        
        const userProfile = Object.entries(formData)
            .map(([key, value]) => `${key}: [${value}]`)
            .join('\n');
        
        try {
            await this.generatePath(userProfile);
        } catch (error) {
            console.error('Error generating learning path:', error);
            alert('Error generating learning path: ' + error.message);
        }
    }
}

/**
 * Class xử lý việc render learning path
 */
class LearningPathRenderer {
    constructor() {
        this.container = document.getElementById('learning-path-container');
    }

    /**
     * Render toàn bộ learning path
     */
    async render(data, userProfile) {
        if (!data) throw new Error('Invalid learning path data');

        try {
            this.container.innerHTML = '';
            
            // Render từng section với userProfile
            this._renderProfileSection(data.user_profile_description);
            this._renderPartnersSection(data.communication_partners);
            this._renderPathSection(data.learning_path, userProfile);
            this._renderMilestonesSection(data.milestones);
            
            // Thêm nút copy
            this._addCopyButton();

        } catch (error) {
            console.error('Render Error:', error);
            this.container.innerHTML = `<p class="error">Error displaying results: ${error.message}</p>`;
        }
    }

    /**
     * Render section Profile
     * @private
     */
    _renderProfileSection(description) {
        const section = document.createElement('div');
        section.className = 'profile-section';
        section.innerHTML = `
            <h3>User Profile</h3>
            <p>${description}</p>
        `;
        this.container.appendChild(section);
    }

    /**
     * Render section Partners
     * @private
     */
    _renderPartnersSection(partners) {
        const section = document.createElement('div');
        section.className = 'partners-section';
        section.innerHTML = `
            <h3>Communication Partners</h3>
            <div class="partners-list">
                ${partners.map(partner => `
                    <div class="partner-item">
                        <h4>${partner.group}</h4>
                        <ul>
                            ${partner.scenarios.map(scenario => `
                                <li>${scenario}</li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        `;
        this.container.appendChild(section);
    }

    /**
     * Render section Learning Path
     * @private
     */
    _renderPathSection(path, userProfile) {
        const section = document.createElement('div');
        section.className = 'learning-path-section';
        section.innerHTML = `
            <h3>Learning Path</h3>
            <div class="weeks-list">
                ${path.map(week => `
                    <div class="week-item">
                        <div class="week-header">
                            <div class="week-title">
                                <h4>Week ${week.week}: ${week.topic}</h4>
                            </div>
                            <div id="chunking-btn-container-${week.week}" class="chunking-btn-container"></div>
                        </div>
                        <ul>
                            ${week.scenarios.map(scenario => `
                                <li>${scenario.scenario}</li>
                            `).join('')}
                        </ul>
                        <div id="chunking-questions-week-${week.week}" class="chunking-questions"></div>
                    </div>
                `).join('')}
            </div>
        `;

        // Pass both userProfile and week data to GenerateQuestionFromTopicAndScenarioButton
        path.forEach(week => {
            const container = section.querySelector(`#chunking-btn-container-${week.week}`);
            const generateButton = new GenerateQuestionFromTopicAndScenarioButton(
                userProfile,
                week
            );
            container.appendChild(generateButton.render());
        });

        this.container.appendChild(section);
    }

    /**
     * Render section Milestones
     * @private
     */
    _renderMilestonesSection(milestones) {
        const section = document.createElement('div');
        section.className = 'milestones-section';
        section.innerHTML = `
            <h3>Milestones</h3>
            <div class="milestones-list">
                ${milestones.map(milestone => `
                    <div class="milestone-item">
                        <h4>${milestone.time}: ${milestone.english_title}</h4>
                        <p>${milestone.vn_detail}</p>
                    </div>
                `).join('')}
            </div>
        `;
        this.container.appendChild(section);
    }

    /**
     * Thêm nút Copy
     * @private
     */
    _addCopyButton() {
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy All';
        copyButton.className = 'copy-btn';
        copyButton.addEventListener('click', () => this._handleCopy());
        this.container.appendChild(copyButton);
    }

    /**
     * Xử lý sự kiện copy
     * @private
     */
    async _handleCopy() {
        try {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = this.container.innerHTML;
            
            // Xóa nút copy khỏi nội dung copy
            const copyBtn = tempDiv.querySelector('.copy-btn');
            if (copyBtn) copyBtn.remove();
            
            await navigator.clipboard.writeText(tempDiv.innerText);
            alert('Learning path copied to clipboard!');
        } catch (error) {
            console.error('Copy Error:', error);
            alert('Failed to copy learning path: ' + error.message);
        }
    }

    _displayQuestions(questions) {
        const container = document.getElementById(`chunking-questions-week-${this.weekData.week}`);
        if (!container) {
            console.error(`Container for week ${this.weekData.week} not found`);
            return;
        }

        // Sample data for UI testing
        const sampleQuestions = {
            scenarios: [
                {
                    scenario: "Project Updates Meeting",
                    questions: [
                        "How do you usually start your project update meetings?",
                        "What key points do you typically cover in these meetings?",
                        "How do you handle questions during the presentation?",
                        "What's your approach to discussing project challenges?"
                    ]
                },
                {
                    scenario: "Team Progress Discussion",
                    questions: [
                        "Could you describe your team's recent achievements?",
                        "What obstacles has your team encountered?",
                        "How do you track individual progress?",
                        "What methods do you use for team collaboration?"
                    ]
                }
            ]
        };

        // Use sample data for UI testing, switch to actual questions when API is ready
        const displayData = questions || sampleQuestions;

        container.innerHTML = `
            <div class="questions-container">
                <h5>Speaking Practice Questions</h5>
                ${displayData.scenarios.map(scenario => `
                    <div class="scenario-questions">
                        <h6>${scenario.scenario}</h6>
                        <ul>
                            ${scenario.questions.map((q, index) => `
                                <li class="question-item">
                                    <div class="question-content">
                                        <span>${q}</span>
                                        <div id="detail-btn-${scenario.scenario.replace(/\s+/g, '-')}-${index}" 
                                             class="detail-btn-container"></div>
                                    </div>
                                    <div id="detail-content-${scenario.scenario.replace(/\s+/g, '-')}-${index}" 
                                         class="detail-content"></div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        `;

        // Add Detail Chunking buttons for each question
        displayData.scenarios.forEach(scenario => {
            scenario.questions.forEach((question, index) => {
                const btnContainer = document.getElementById(
                    `detail-btn-${scenario.scenario.replace(/\s+/g, '-')}-${index}`
                );
                const detailButton = new DetailChunkingFromQuestionButton(
                    scenario.scenario,
                    question,
                    `detail-content-${scenario.scenario.replace(/\s+/g, '-')}-${index}`
                );
                btnContainer.appendChild(detailButton.render());
            });
        });
    }
}

// Export class để sử dụng
export const learningPathManager = new LearningPathManager();

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', handleGenerateClick);
    }
});
