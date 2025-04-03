// Import các dependencies
import { config } from './config.js';
import { FromUserProfileGenLearningPath } from './components/A_FromUserProfileGenLearningPath.js';
import { From1TopicGen20QuestionChunking } from './components/B1_From1TopicGen20QuestionChunking.js';
import { From1QuestionGenDetailChunking } from './components/B2_From1QuestionGenDetailChunking.js';
import { FromDetailChunkingGen4Exercise } from './components/B3_FromDetailChunkingGen4Exercise.js';

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
                        <div id="detail-chunking-week-${week.week}" class="detail-chunking"></div>
                    </div>
                `).join('')}
            </div>
        `;

        // Pass both userProfile and week data to From1TopicGen20QuestionChunking
        path.forEach(week => {
            const container = section.querySelector(`#chunking-btn-container-${week.week}`);
            const generateButton = new From1TopicGen20QuestionChunking(
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
}

/**
 * Class quản lý toàn bộ Learning Path
 */
class LearningPathManager {
    constructor() {
        console.log('LearningPathManager initialized');
        this.pathGenerator = new FromUserProfileGenLearningPath();
        this.renderer = new LearningPathRenderer();
        
        // Thêm event listener cho button click
        const generateButton = document.getElementById('generate-path-btn');
        if (generateButton) {
            console.log('Adding click listener to generate button');
            generateButton.onclick = async () => {
                console.log('Button clicked');
                await this._handleFormSubmit();
            };
        } else {
            console.error('Generate button not found');
        }
    }

    /**
     * Xử lý form submit
     * @private
     */
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
            const data = await this.pathGenerator.generatePath(userProfile);
            await this.renderer.render(data, userProfile);
        } catch (error) {
            console.error('Error generating learning path:', error);
            alert('Error generating learning path: ' + error.message);
        }
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

function handleGenerateClick() {
    // Implementation of handleGenerateClick function
}

function handleGenerateDetailClick(detail) {
    console.log('=== START HANDLE GENERATE DETAIL CLICK ===');
    console.log('Detail received:', detail);
    console.log('Detail ID:', detail.id);
    console.log('Looking for container with ID:', `detail-content-${detail.id}`);

    // Validate detail object
    if (!detail || !detail.id) {
        console.error('Invalid detail object:', detail);
        return;
    }

    const exerciseComponent = new FromDetailChunkingGen4Exercise(detail);
    const exerciseContainer = exerciseComponent.render();
    console.log('Exercise container created:', exerciseContainer);

    // Log all detail content containers for debugging
    const allDetailContainers = document.querySelectorAll('.detail-content');
    console.log('All detail containers found:', allDetailContainers.length);
    allDetailContainers.forEach(container => {
        console.log('Container ID:', container.id);
        console.log('Container visible:', container.offsetParent !== null);
    });

    // Tìm container chứa detail content dựa vào ID
    const detailContentContainer = document.querySelector(`#detail-content-${detail.id}`);
    if (detailContentContainer) {
        console.log('Found detail content container:', detailContentContainer);
        console.log('Container dimensions:', {
            offsetHeight: detailContentContainer.offsetHeight,
            clientHeight: detailContentContainer.clientHeight,
            scrollHeight: detailContentContainer.scrollHeight,
            offsetWidth: detailContentContainer.offsetWidth
        });
        
        // Tìm hoặc tạo detail chunking container
        let detailChunkingContainer = detailContentContainer.querySelector('.detail-chunking-container');
        if (!detailChunkingContainer) {
            console.log('Creating new detail chunking container');
            detailChunkingContainer = document.createElement('div');
            detailChunkingContainer.className = 'detail-chunking-container';
            detailContentContainer.appendChild(detailChunkingContainer);
        }
        
        // Thêm exercise container vào detail chunking container
        detailChunkingContainer.appendChild(exerciseContainer);
        console.log('Added exercise container to detail chunking container');
        
        // Log final container state
        console.log('Final container state:', {
            hasExerciseContainer: detailChunkingContainer.contains(exerciseContainer),
            exerciseContainerVisible: exerciseContainer.offsetParent !== null,
            exerciseContainerDimensions: {
                offsetHeight: exerciseContainer.offsetHeight,
                clientHeight: exerciseContainer.clientHeight,
                scrollHeight: exerciseContainer.scrollHeight,
                offsetWidth: exerciseContainer.offsetWidth
            }
        });
    } else {
        console.error(`Detail content container not found for ID: ${detail.id}`);
        // Log DOM structure for debugging
        console.log('Current DOM structure:', document.body.innerHTML);
    }
    console.log('=== END HANDLE GENERATE DETAIL CLICK ===');
}
