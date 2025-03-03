/**
 * Configuration for parallel processing of OpenAI requests
 */
const maxWorkersConfig = {
    // Maximum number of concurrent OpenAI API requests
    MAX_CONCURRENT_REQUESTS: 4,
    
    // Whether to enable detailed logging for parallel processing
    ENABLE_PARALLEL_LOGGING: true,
    
    // Format timestamps for logs
    formatTimestamp: () => `[${new Date().toISOString()}]`
};

module.exports = maxWorkersConfig; 