// Import các dependencies
import { config } from './config.js';
import { showLoadingDialog, hideLoadingDialog, updateLoadingProgress } from './utils.js';
import { generateUniqueId } from './generateQuestion.js';
import learningCache from './modules/cache.js';


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
        this.currentUserId = null;
        this.data = null;
    }

    /**
     * Khởi tạo Learning Path từ user profile
     * @param {string} userProfile - Thông tin profile của user
     */
    async generatePath(userProfile) {
        console.log('generatePath called with:', userProfile);
        try {
            this.currentUserId = generateUniqueId();
            console.log('Generated userId:', this.currentUserId);
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
            const cachedData = this.cache.get('path', this.currentUserId);
            if (cachedData) {
                console.log('Found cached data');
                this.data = {
                    ...cachedData,
                    user_id: this.currentUserId
                };
                return this._displayResults();
            }

            console.log('No cache found, calling API...');
            showLoadingDialog();
            updateLoadingProgress(10);
            
            const data = await this._fetchFromAPI(userProfile);
            this.data = {
                ...JSON.parse(data.learningPath),
                user_id: this.currentUserId
            };

            // Lưu vào cache
            this.cache.set('path', data, this.currentUserId);
            
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
        await renderer.render(this.data);
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
    async render(data) {
        if (!data) throw new Error('Invalid learning path data');

        try {
            this.container.innerHTML = '';
            
            // Render từng section
            this._renderProfileSection(data.user_profile_description);
            this._renderPartnersSection(data.communication_partners);
            this._renderPathSection(data.learning_path);
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
    _renderPathSection(path) {
        const section = document.createElement('div');
        section.className = 'learning-path-section';
        section.innerHTML = `
            <h3>Learning Path</h3>
            <div class="weeks-list">
                ${path.map(week => `
                    <div class="week-item">
                        <h4>Week ${week.week}: ${week.topic}</h4>
                        <ul>
                            ${week.scenarios.map(scenario => `
                                <li>${scenario.scenario}</li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        `;
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

// Export class để sử dụng
export const learningPathManager = new LearningPathManager();
