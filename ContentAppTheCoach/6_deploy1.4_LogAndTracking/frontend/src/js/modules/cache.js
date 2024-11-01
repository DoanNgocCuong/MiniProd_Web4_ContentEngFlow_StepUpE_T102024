// class LearningCache {
//     constructor() {
//         this.CACHE_PREFIX = 'learning_cache_';
//         this.modules = ['qna', 'card', 'meaning', 'flexible'];
//     }

//     clearAll() {
//         console.log('Starting cache clear operation...');
        
//         // Clear localStorage cache
//         this.modules.forEach(module => {
//             const key = this.CACHE_PREFIX + module;
//             if (localStorage.getItem(key)) {
//                 localStorage.removeItem(key);
//                 console.log(`Cleared cache for ${module}`);
//             }
//         });

//         // Verify all caches are cleared
//         const remainingCaches = this.modules.filter(module => this.has(module));
//         if (remainingCaches.length === 0) {
//             console.log('All caches successfully cleared');
//         } else {
//             console.warn('Some caches remain:', remainingCaches);
//         }
//     }

//     set(module, data) {
//         if (!this.modules.includes(module)) {
//             console.warn(`Invalid module: ${module}`);
//             return;
//         }
//         const key = this.CACHE_PREFIX + module;
//         localStorage.setItem(key, JSON.stringify(data));
//         console.log(`Cache set for ${module}`);
//     }

//     get(module) {
//         if (!this.modules.includes(module)) {
//             console.warn(`Invalid module: ${module}`);
//             return null;
//         }
//         const key = this.CACHE_PREFIX + module;
//         const data = localStorage.getItem(key);
//         console.log(`Cache ${data ? 'found' : 'not found'} for ${module}`);
//         return data ? JSON.parse(data) : null;
//     }

//     has(module) {
//         if (!this.modules.includes(module)) {
//             console.warn(`Invalid module: ${module}`);
//             return false;
//         }
//         const key = this.CACHE_PREFIX + module;
//         return localStorage.getItem(key) !== null;
//     }
// }

// const learningCache = new LearningCache();
// export default learningCache; 