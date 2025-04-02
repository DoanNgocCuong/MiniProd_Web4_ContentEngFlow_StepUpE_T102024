class LearningCache {
    constructor() {
        this.CACHE_PREFIX = 'learning_cache_';
        this.modules = ['qna', 'card', 'meaning', 'flexible'];
        
        // Thêm bộ nhớ cache tạm thời để tránh encode/decode
        this.memoryCache = {
            meaning: null
        };
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
        if (module === 'meaning') {
            // Lưu vào memory cache thay vì localStorage
            this.memoryCache.meaning = {
                data: data,
                timestamp: Date.now(),
                lesson_id: lesson_id
            };
            console.log('Storing Learning Meaning in memory cache to preserve HTML tags');
            return;
        }
        
        // Đối với các module khác, vẫn dùng localStorage
        const cacheData = {
            data: data,
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
        
        // Đặc biệt xử lý module meaning từ memory cache
        if (module === 'meaning' && this.memoryCache.meaning) {
            const cache = this.memoryCache.meaning;
            if (cache.lesson_id === lesson_id) {
                console.log(`Using memory cache for ${module}`);
                return cache.data;
            }
            return null;
        }
        
        // Các module khác vẫn dùng localStorage
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
        this.memoryCache.meaning = null;
        this.clearAll();
        console.log('All caches invalidated for new lesson');
    }

    // Loại bỏ hoặc đơn giản hóa các phương thức mã hóa/giải mã
    encodeHtmlTags(data) {
        return data; // Không mã hóa nữa
    }

    decodeHtmlTags(data) {
        return data; // Không giải mã nữa
    }
}

const learningCache = new LearningCache();
export default learningCache; 