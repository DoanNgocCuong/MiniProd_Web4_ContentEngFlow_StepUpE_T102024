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
    // Lấy tất cả các nút tab từ DOM bằng class 'tab-btn'
    const tabBtns = document.querySelectorAll('.tab-btn');
    // Lấy tất cả nội dung tab từ DOM bằng class 'tab-content' 
    const tabContents = document.querySelectorAll('.tab-content');

    // Duyệt qua từng nút tab để thêm sự kiện click
    tabBtns.forEach(btn => {
        // Khi người dùng click vào nút tab
        btn.addEventListener('click', () => {
            // Lấy ID của tab từ thuộc tính data-tab
            const tabId = btn.getAttribute('data-tab');
            // Gọi hàm cập nhật trạng thái tab
            updateTabState(tabBtns, tabContents, tabId);
        });
    });
}

// Hàm cập nhật trạng thái hiển thị của các tab
function updateTabState(tabBtns, tabContents, activeTabId) {
    // Xóa class 'active' khỏi tất cả các nút tab
    tabBtns.forEach(b => b.classList.remove('active'));
    // Xóa class 'active' khỏi tất cả nội dung tab
    tabContents.forEach(content => content.classList.remove('active'));

    // Tìm nút tab đang được chọn dựa vào activeTabId
    const activeBtn = Array.from(tabBtns).find(b => b.getAttribute('data-tab') === activeTabId);
    // Tìm nội dung tab tương ứng dựa vào activeTabId
    const activeContent = Array.from(tabContents).find(content => content.id === activeTabId);

    // Nếu tìm thấy cả nút tab và nội dung tab
    if (activeBtn && activeContent) {
        // Thêm class 'active' vào nút tab được chọn
        activeBtn.classList.add('active');
        // Thêm class 'active' vào nội dung tab tương ứng để hiển thị
        activeContent.classList.add('active');
    }
}


/**
 * ---------------------------------------------------------------------------------------------------------
 * Exercise Generation
 * ---------------------------------------------------------------------------------------------------------
 */

document.querySelectorAll('.tab-btn').forEach(button => {
   button.addEventListener('click', function() {
       const tabId = this.dataset.tab;
       
       // Active tab trong UI
       document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
       this.classList.add('active');
       
       document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
       document.getElementById(tabId).classList.add('active');

       // Kiểm tra nếu đã có dữ liệu từ generateQuestion
       if (storagedLessons && storagedLessons.length > 0) {
           // Call the appropriate function based on the tab clicked
           if (tabId === 'learning-meaning') {
               generateLearningMeaning(storagedLessons); // Cache sẽ được kiểm tra trong hàm này
           } else if (tabId === 'learning-card') {
               generateLearningCard(storagedLessons); // Cache sẽ được kiểm tra trong hàm này
           } else if (tabId === 'flexible-phrase') {
               generateLearningFlexible(storagedLessons); // Cache sẽ được kiểm tra trong hàm này
           } else if (tabId === 'learning-qna') {
               generateLearningQNA(storagedLessons); // Cache sẽ được kiểm tra trong hàm này
           }
       }
   });
});




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