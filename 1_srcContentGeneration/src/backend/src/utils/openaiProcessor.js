/**
 * Utility for processing OpenAI requests in parallel
 */
const { MAX_CONCURRENT_REQUESTS, ENABLE_PARALLEL_LOGGING, formatTimestamp } = require('../config/maxWorkers');

/**
 * Process a single item with OpenAI
 * @param {Object} item - The data to process
 * @param {Function} processFn - The function that processes a single item
 * @param {String} itemType - Type of item being processed (for logging)
 * @returns {Promise<any>} - Promise resolving to processed result
 */
async function processItem(item, processFn, itemType = 'item') {
    if (!ENABLE_PARALLEL_LOGGING) {
        return processFn(item);
    }
    
    const itemId = item.id || Math.floor(Math.random() * 1000);
    const startTime = Date.now();
    
    console.log(`${formatTimestamp()} START processing ${itemType} ${itemId}`);
    
    try {
        const result = await processFn(item);
        
        const processingTime = (Date.now() - startTime) / 1000;
        console.log(`${formatTimestamp()} FINISH processing ${itemType} ${itemId} in ${processingTime.toFixed(2)}s`);
        
        return result;
    } catch (error) {
        const processingTime = (Date.now() - startTime) / 1000;
        console.error(`${formatTimestamp()} ERROR processing ${itemType} ${itemId} after ${processingTime.toFixed(2)}s: ${error.message}`);
        throw error;
    }
}

/**
 * Process items in parallel batches
 * @param {Array} items - Array of items to process
 * @param {Function} processFn - Function to process each item
 * @param {Object} options - Processing options
 * @returns {Promise<Array>} - Promise resolving to all results
 */
async function processInParallelBatches(items, processFn, options = {}) {
    const {
        batchSize = MAX_CONCURRENT_REQUESTS,
        itemType = 'item',
        shouldFlatten = true
    } = options;
    
    if (ENABLE_PARALLEL_LOGGING) {
        console.log(`${formatTimestamp()} Starting to process ${items.length} ${itemType}s with ${batchSize} concurrent workers`);
    }
    const startTime = Date.now();
    
    const results = [];
    const totalBatches = Math.ceil(items.length / batchSize);
    
    for (let i = 0; i < items.length; i += batchSize) {
        const batchNum = Math.floor(i / batchSize) + 1;
        const batch = items.slice(i, i + batchSize);
        
        if (ENABLE_PARALLEL_LOGGING) {
            console.log(`${formatTimestamp()} Processing ${itemType} batch ${batchNum}/${totalBatches} with ${batch.length} items`);
        }
        const batchStartTime = Date.now();
        
        try {
            // Process all items in this batch in parallel
            const batchPromises = batch.map(item => 
                processItem(item, processFn, itemType)
            );
            
            // Wait for all items in the batch to complete
            const batchResults = await Promise.all(batchPromises);
            
            // Add results from this batch
            if (shouldFlatten) {
                // Flatten results if they are arrays
                for (const result of batchResults) {
                    if (Array.isArray(result)) {
                        results.push(...result);
                    } else if (result !== undefined) {
                        results.push(result);
                    }
                }
            } else {
                // Just add the results as-is
                results.push(...batchResults);
            }
            
            if (ENABLE_PARALLEL_LOGGING) {
                const batchTime = (Date.now() - batchStartTime) / 1000;
                console.log(`${formatTimestamp()} Completed ${itemType} batch ${batchNum}/${totalBatches} in ${batchTime.toFixed(2)}s`);
            }
        } catch (batchError) {
            console.error(`Error processing ${itemType} batch ${batchNum}:`, batchError);
            // Continue with next batch instead of failing completely
        }
    }
    
    if (ENABLE_PARALLEL_LOGGING) {
        const totalTime = (Date.now() - startTime) / 1000;
        console.log(`${formatTimestamp()} All ${itemType} processing completed in ${totalTime.toFixed(2)}s`);
    }
    
    return results;
}

module.exports = {
    processItem,
    processInParallelBatches
}; 