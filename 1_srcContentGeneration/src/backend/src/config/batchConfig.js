/**
 * Configuration for batch processing and token limits
 */
const batchConfig = {
    // Maximum items per batch for OpenAI requests
    BATCH_SIZE: 100,
    
    // Maximum tokens for OpenAI API calls
    MAX_TOKENS: 10000,
    
    // Timeout in milliseconds
    TIMEOUT: 120000
};

module.exports = batchConfig; 
