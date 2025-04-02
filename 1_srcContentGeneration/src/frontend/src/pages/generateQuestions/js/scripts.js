// scripts.js


import { handleGenerateClick, storagedLessons } from './generateQuestion.js';
import { generateLearningMeaning } from './modules/learningMeaning.js';
import { generateLearningCard } from './modules/learningCard.js';
import { generateLearningFlexible } from './modules/learningFlexible.js';
import { generateLearningQNA } from './modules/learningQNA.js';
import { initializeFeedback } from './feedback.js';
import { learningPathManager } from './learningPath.js';

/**
 * ---------------------------------------------------------------------------------------------------------
 * Event Listeners and Initialization
 * ---------------------------------------------------------------------------------------------------------
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');

    // Kiểm tra từng element
    const generateBtn = document.getElementById('generate-btn');
    const copySelectedBtn = document.getElementById('copy-selected-lessons');
    const userProfileForm = document.getElementById('user-profile-form');

    // Log để debug
    console.log('Elements found:', {
        generateBtn: !!generateBtn,
        copySelectedBtn: !!copySelectedBtn,
        userProfileForm: !!userProfileForm
    });

    // Chỉ thêm event listeners nếu elements tồn tại
    if (generateBtn) {
        generateBtn.addEventListener('click', handleGenerateClick);
    } else {
        console.error('Generate button not found');
    }

    if (copySelectedBtn) {
        copySelectedBtn.addEventListener('click', copyCheckedLessons);
    } else {
        console.error('Copy selected button not found');
    }

    if (userProfileForm) {
        console.log('Adding submit listener to user profile form');
        userProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Form submitted');
            
            const formData = {
                industry: document.getElementById('industry')?.value || '',
                job: document.getElementById('job')?.value || '',
                englishLevel: document.getElementById('englishLevel')?.value || '',
                learningGoals: document.getElementById('learningGoals')?.value || ''
            };
            
            console.log('Form data:', formData);
            
            const userProfile = Object.entries(formData)
                .map(([key, value]) => `${key}: [${value}]`)
                .join('\n');
            
            try {
                await learningPathManager.generatePath(userProfile);
            } catch (error) {
                console.error('Error generating learning path:', error);
                alert('Error generating learning path: ' + error.message);
            }
        });
    } else {
        console.error('User profile form not found');
    }

    // Khởi tạo các chức năng khác nếu cần
    initializeTabs();
    initializeFeedback();
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