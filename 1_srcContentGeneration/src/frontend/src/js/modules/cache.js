class LearningCache {
    constructor() {
        this.CACHE_PREFIX = 'learning_cache_';
        this.modules = ['qna', 'card', 'meaning', 'flexible'];
    }

    clearAll() {
        console.log('Starting cache clear operation...');
        
        // Clear localStorage cache
        this.modules.forEach(module => {
            const key = this.CACHE_PREFIX + module;
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
                console.log(`Cleared cache for ${module}`);
            }
        });

        // Verify all caches are cleared
        const remainingCaches = this.modules.filter(module => this.has(module));
        if (remainingCaches.length === 0) {
            console.log('All caches successfully cleared');
        } else {
            console.warn('Some caches remain:', remainingCaches);
        }
    }

    set(module, data, lesson_id) {
        if (!this.modules.includes(module)) {
            console.warn(`Invalid module: ${module}`);
            return;
        }
        
        // Xử lý đặc biệt cho module 'meaning' để bảo vệ HTML tags
        let processedData = data;
        if (module === 'meaning') {
            // Mã hóa các thẻ HTML để an toàn khi lưu vào JSON
            processedData = this.encodeHtmlTags(data);
            console.log('HTML tags encoded for safe storage in meaning cache');
        }
        
        // Thêm thông tin thời gian cache và lesson_id
        const cacheData = {
            data: processedData,
            timestamp: Date.now(),
            lesson_id: lesson_id
        };
        
        const key = this.CACHE_PREFIX + module;
        localStorage.setItem(key, JSON.stringify(cacheData));
        console.log(`Cache set for ${module} with lesson_id: ${lesson_id}`);
    }

    get(module, lesson_id) {
        if (!this.modules.includes(module)) {
            console.warn(`Invalid module: ${module}`);
            return null;
        }
        
        const key = this.CACHE_PREFIX + module;
        const cachedString = localStorage.getItem(key);
        
        if (!cachedString) {
            console.log(`No cache found for ${module}`);
            return null;
        }
        
        try {
            const cachedData = JSON.parse(cachedString);
            
            // Kiểm tra nếu cache thuộc về lesson_id hiện tại
            if (cachedData.lesson_id !== lesson_id) {
                console.log(`Cache for ${module} belongs to different lesson_id, ignoring`);
                return null;
            }
            
            // Giải mã HTML tags nếu là module meaning
            let resultData = cachedData.data;
            if (module === 'meaning') {
                resultData = this.decodeHtmlTags(resultData);
                console.log('HTML tags decoded from meaning cache');
            }
            
            console.log(`Cache found for ${module}, cached at: ${new Date(cachedData.timestamp).toLocaleTimeString()}`);
            return resultData;
        } catch (e) {
            console.error(`Error parsing cache for ${module}:`, e);
            return null;
        }
    }

    has(module) {
        if (!this.modules.includes(module)) {
            console.warn(`Invalid module: ${module}`);
            return false;
        }
        const key = this.CACHE_PREFIX + module;
        return localStorage.getItem(key) !== null;
    }
    
    // Xóa cache khi lesson_id thay đổi
    invalidateForNewLesson() {
        this.clearAll();
        console.log('Cache invalidated for new lesson');
    }

    // Thêm các phương thức encode/decode HTML tags
    encodeHtmlTags(data) {
        if (!Array.isArray(data)) return data;
        
        return data.map(item => {
            const newItem = {...item};
            
            // Đặc biệt xử lý các trường có thể chứa HTML
            if (newItem.sentence) {
                newItem.sentence = newItem.sentence
                    .replace(/<g>/g, '___G_START___')
                    .replace(/<\/g>/g, '___G_END___')
                    .replace(/<r>/g, '___R_START___')
                    .replace(/<\/r>/g, '___R_END___');
            }
            
            if (newItem.answer_2_description) {
                newItem.answer_2_description = newItem.answer_2_description
                    .replace(/<r>/g, '___R_START___')
                    .replace(/<\/r>/g, '___R_END___');
            }
            
            if (newItem.answer_3_description) {
                newItem.answer_3_description = newItem.answer_3_description
                    .replace(/<r>/g, '___R_START___')
                    .replace(/<\/r>/g, '___R_END___');
            }
            
            return newItem;
        });
    }

    decodeHtmlTags(data) {
        if (!Array.isArray(data)) return data;
        
        return data.map(item => {
            const newItem = {...item};
            
            // Đặc biệt xử lý các trường có thể chứa HTML
            if (newItem.sentence) {
                newItem.sentence = newItem.sentence
                    .replace(/___G_START___/g, '<g>')
                    .replace(/___G_END___/g, '</g>')
                    .replace(/___R_START___/g, '<r>')
                    .replace(/___R_END___/g, '</r>');
            }
            
            if (newItem.answer_2_description) {
                newItem.answer_2_description = newItem.answer_2_description
                    .replace(/___R_START___/g, '<r>')
                    .replace(/___R_END___/g, '</r>');
            }
            
            if (newItem.answer_3_description) {
                newItem.answer_3_description = newItem.answer_3_description
                    .replace(/___R_START___/g, '<r>')
                    .replace(/___R_END___/g, '</r>');
            }
            
            return newItem;
        });
    }
}

const learningCache = new LearningCache();
export default learningCache; 