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
        
        // Thêm thông tin thời gian cache và lesson_id
        const cacheData = {
            data: data,
            timestamp: Date.now(),
            lesson_id: lesson_id
        };
        
        // Lưu ý đặc biệt: không xử lý hoặc làm sạch dữ liệu HTML trong module meaning
        // để bảo toàn các thẻ <g> và <r>
        
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
            
            console.log(`Cache found for ${module}, cached at: ${new Date(cachedData.timestamp).toLocaleTimeString()}`);
            return cachedData.data;
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
}

const learningCache = new LearningCache();
export default learningCache; 