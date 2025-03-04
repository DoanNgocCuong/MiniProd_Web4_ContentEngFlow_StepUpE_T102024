// scripts.js


import { handleGenerateClick, storagedLessons } from './generateQuestion.js';
import { generateLearningMeaning } from './modules/learningMeaning.js';
import { generateLearningCard } from './modules/learningCard.js';
import { generateLearningFlexible } from './modules/learningFlexible.js';
import { generateLearningQNA } from './modules/learningQNA.js';
import { initializeFeedback } from './feedback.js';
import learningCache from './modules/cache.js';

/**
 * ---------------------------------------------------------------------------------------------------------
 * Event Listeners and Initialization
 * ---------------------------------------------------------------------------------------------------------
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializeFeedback(); // Initialize feedback functionality
    document.getElementById('generate-btn').addEventListener('click', handleGenerateClick);
    document.getElementById('copy-selected-lessons').addEventListener('click', copyCheckedLessons);
});

// Hàm khởi tạo các tab trong giao diện
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Remove active class from all buttons and content
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current button and content
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');

            // Kiểm tra nếu đã có dữ liệu từ generateQuestion
            if (storagedLessons && storagedLessons.length > 0) {
                // Call the appropriate function based on the tab clicked
                if (tabId === 'learning-meaning') {
                    generateLearningMeaning(storagedLessons);
                } else if (tabId === 'learning-card') {
                    generateLearningCard(storagedLessons);
                } else if (tabId === 'flexible-phrase') {
                    generateLearningFlexible(storagedLessons);
                } else if (tabId === 'learning-qna') {
                    generateLearningQNA(storagedLessons);
                }
            }
        });
    });
}

/**
 * ---------------------------------------------------------------------------------------------------------
 * Exercise Generation
 * ---------------------------------------------------------------------------------------------------------
 */

/**
 * ---------------------------------------------------------------------------------------------------------
 * Generate Learning Meaning
 * ---------------------------------------------------------------------------------------------------------
 */


/**
 * ---------------------------------------------------------------------------------------------------------
 * Generate Learning Card
 * ---------------------------------------------------------------------------------------------------------
 */



/**
 * ---------------------------------------------------------------------------------------------------------
 * Generate Learning Flexible
 * ---------------------------------------------------------------------------------------------------------
 */

// ... existing code ...

/**
 * ---------------------------------------------------------------------------------------------------------
 * Generate Learning Flexible
 * ---------------------------------------------------------------------------------------------------------
 */

// Add this to your existing JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const feedbackBtn = document.getElementById('feedback-btn');
    const feedbackModal = document.getElementById('feedback-modal');
    const closeModal = document.querySelector('.close-modal');
    const sendFeedbackBtn = document.getElementById('send-feedback-btn');

    // Open modal
    feedbackBtn.addEventListener('click', () => {
        feedbackModal.style.display = 'block';
    });

    // Close modal when clicking X
    closeModal.addEventListener('click', () => {
        feedbackModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === feedbackModal) {
            feedbackModal.style.display = 'none';
        }
    });
});