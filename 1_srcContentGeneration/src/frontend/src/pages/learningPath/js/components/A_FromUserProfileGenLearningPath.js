import { config } from '../config.js';
import { showLoadingDialog, hideLoadingDialog, updateLoadingProgress } from '../utils.js';
import learningCache from './modules/cache.js';

export class FromUserProfileGenLearningPath {
    constructor() {
        this.API_URL = config.production.apiUrl;
        this.cache = learningCache;
        this.data = null;
        this.userProfile = null;
    }

    /**
     * Generate learning path from user profile
     * @param {string} userProfile - User profile information
     * @returns {Promise<Object>} Learning path data
     */
    async generatePath(userProfile) {
        console.log('generatePath called with:', userProfile);
        try {
            this.userProfile = userProfile;
            return await this._processLearningPath(userProfile);
        } catch (error) {
            console.error('Learning Path Error:', error);
            throw error;
        }
    }

    /**
     * Process learning path generation
     * @private
     */
    async _processLearningPath(userProfile) {
        try {
            // Check cache
            const cachedData = this.cache.get('path', userProfile);
            if (cachedData) {
                console.log('Found cached data');
                this.data = {
                    ...cachedData,
                    user_id: userProfile
                };
                return this.data;
            }

            console.log('No cache found, calling API...');
            showLoadingDialog();
            updateLoadingProgress(10);
            
            const data = await this._fetchFromAPI(userProfile);
            const parsedLearningPath = JSON.parse(data.learningPath);
            
            this.data = {
                ...parsedLearningPath,
                user_id: userProfile
            };

            // Save to cache
            this.cache.set('path', this.data, userProfile);
            
            updateLoadingProgress(100);
            return this.data;

        } catch (error) {
            console.error('Process error:', error);
            throw new Error(`Failed to process learning path: ${error.message}`);
        } finally {
            hideLoadingDialog();
        }
    }

    /**
     * Fetch learning path from API
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
}
