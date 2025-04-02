// generateQuestion.js

import { config } from './config.js';
import { showLoadingDialog, hideLoadingDialog } from './utils.js';
import TableDraftTracking from './trackings/tableDraftTracking.js';
import learningCache from './components/modules/cache.js';
import { generateLearningMeaning } from './components/modules/learningMeaning.js';
import { generateLearningCard } from './components/modules/learningCard.js';
import { generateLearningFlexible } from './components/modules/learningFlexible.js';
import { generateLearningQNA } from './components/modules/learningQNA.js';

const API_URL = config.production.apiUrl;
let storagedLessons;
let inputDataTemp;  
let rawResponseTemp; 

/**
 * ---------------------------------------------------------------------------------------------------------
 * Question Generation
 * ---------------------------------------------------------------------------------------------------------
 */

async function handleGenerateClick() {
    learningCache.invalidateForNewLesson();
    
    const activeTab = document.querySelector('.tab-content.active');
    const isStandardForm = activeTab.id === 'standard-form';

    try {
        let generateQuestionInput;
        if (isStandardForm) {
            inputDataTemp = {
                topic: document.getElementById('topic').value,
                level: document.getElementById('level').value,
                questionCount: document.getElementById('question-count').value,
                extraRequirements: document.getElementById('extra-requirements').value
            };

            generateQuestionInput = createGenerateQuestionInput(inputDataTemp);
        } else {
            generateQuestionInput = document.getElementById('custom-prompt-text').value;
            
            if (!generateQuestionInput.match(/^Generate \d+ English/i)) {
                generateQuestionInput = `Generate questions with the following prompt: ${generateQuestionInput}`;
                console.log('generateQuestionInput', generateQuestionInput);
            }
            
            inputDataTemp = {
                topic: 'Custom Prompt',
                level: 'N/A',
                questionCount: generateQuestionInput.match(/Generate (\d+)/i)?.[1] || 'N/A',
                extraRequirements: generateQuestionInput.substring(0, 100) + '...'
            };
        }

        showLoadingDialog();
        const response = await fetch(`${API_URL}/generate-questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ generateQuestionInput })
        });
        
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }
        
        const processedData = await processApiResponse(data);
        rawResponseTemp = [...processedData];
        storagedLessons = processedData;

    } catch (error) {
        console.error('Error in handleGenerateClick:', error);
        alert(error.message);
    } finally {
        hideLoadingDialog();
    }
}

function createGenerateQuestionInput(formData) {
    const { topic, level, questionCount, extraRequirements } = formData;
    let generateQuestionInput = `Generate ${questionCount} English questions about ${topic}`;
    
    if (level) {
        generateQuestionInput += ` at ${level} level`;
    }
    
    if (extraRequirements) {
        generateQuestionInput += `. Additional requirements: ${extraRequirements}`;
    }

    return generateQuestionInput;
}

async function processApiResponse(response) {
    if (!response || !response.questions || !Array.isArray(response.questions)) {
        throw new Error('Invalid API response structure');
    }

    try {
        console.log('Raw API response:', response);

        let lessons = response.questions;
        const lesson_id = TableDraftTracking.generateLessonId(inputDataTemp.topic);
        
        // Thêm lesson_id vào mỗi câu hỏi
        lessons = lessons.map(item => ({
            ...item,
            lesson_id: lesson_id
        }));

        displayGeneratedQuestions(lessons);
        regenerateAllLearningModules();
        
        return lessons;
    } catch (error) {
        console.error('Error processing API response:', error);
        throw error;
    }
}


/**
 * ---------------------------------------------------------------------------------------------------------
 * Question Display and Editing
 * ---------------------------------------------------------------------------------------------------------
 */

function displayGeneratedQuestions(lessons) {
    const container = document.getElementById('question-container');
    container.textContent = '';
    const table = createLessonTable(lessons);
    container.appendChild(table);
    addCopyButton(container, table);

    // Add event listeners for delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            deleteLesson(index, lessons);
        });
    });
}

function deleteLesson(index, lessons) {
    if (confirm('Are you sure you want to delete this lesson?')) {
        lessons.splice(index, 1);
        displayGeneratedQuestions(lessons);
        
        // Cập nhật lại tất cả các module học tập khi xóa bài học
        learningCache.invalidateForNewLesson();
        regenerateAllLearningModules();
    }
}

function createLessonTable(lessons) {
    const table = document.createElement('table');
    table.className = 'lesson-table';
    table.appendChild(createTableHeader());
    table.appendChild(createTableBody(lessons));
    addEditButtonListeners(table, lessons);
    return table;
}

function createTableHeader() {
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Question</th>
            <th>Structure</th>
            <th>Main Phrase</th>
            <th>Alternative Option 1</th>
            <th>Alternative Option 2</th>
            <th>Question (VI)</th>
            <th>Structure (VI)</th>
            <th>Main Phrase (VI)</th>
            <th>Alternative Option 1 (VI)</th>
            <th>Alternative Option 2 (VI)</th>
            <th>Actions</th>
            <th>Actions</th>
        </tr>
    `;
    return thead;
}

function createTableBody(lessons) {
    const tbody = document.createElement('tbody');
    lessons.forEach((q, index) => {
        const row = document.createElement('tr');
        row.setAttribute('data-lesson-id', q.lesson_id); // Thêm lesson_id vào attribute của row
        row.innerHTML = `
            <td>${q.question}</td>
            <td>${q.structure}</td>
            <td>${q['main phrase']}</td>
            <td>${q['optional phrase 1']}</td>
            <td>${q['optional phrase 2']}</td>
            <td>${q['question-vi']}</td>
            <td>${q['structure-vi']}</td>
            <td>${q['main phrase-vi']}</td>
            <td>${q['optional phrase 1-vi']}</td>
            <td>${q['optional phrase 2-vi']}</td>
            <td><button class="edit-btn" data-index="${index}">Edit</button></td>         
            <td><button class="delete-btn" data-index="${index}">Delete</button></td>
        `;
        tbody.appendChild(row);
    });
    return tbody;
}

function addEditButtonListeners(table, lessons) {
    table.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-btn')) {
            const index = event.target.dataset.index;
            openEditDialog(lessons[index], index);
        }
    });
}

async function copyTableToClipboard(table) {
    try {
        const tempTable = document.createElement('table');
        const tbody = document.createElement('tbody');
        const rows = table.querySelectorAll('tbody tr');
        
        // Create temporary table for copying
        rows.forEach(row => {
            const newRow = document.createElement('tr');
            for (let i = 0; i < row.cells.length - 2; i++) {
                const cell = row.cells[i].cloneNode(true);
                newRow.appendChild(cell);
            }
            tbody.appendChild(newRow);
        });
        
        tempTable.appendChild(tbody);
        
        // Copy to clipboard logic
        tempTable.style.position = 'absolute';
        tempTable.style.left = '-9999px';
        document.body.appendChild(tempTable);
        
        const range = document.createRange();
        range.selectNode(tempTable);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        
        document.body.removeChild(tempTable);

        // Alert copy success first
        alert('Table copied to clipboard!');

        // Extract final table data
        const finalTableData = Array.from(table.querySelectorAll('tbody tr')).map(row => ({
            question: row.cells[0].textContent,
            structure: row.cells[1].textContent,
            'main phrase': row.cells[2].textContent,
            'optional phrase 1': row.cells[3].textContent,
            'optional phrase 2': row.cells[4].textContent,
            'question-vi': row.cells[5].textContent,
            'structure-vi': row.cells[6].textContent,
            'main phrase-vi': row.cells[7].textContent,
            'optional phrase 1-vi': row.cells[8].textContent,
            'optional phrase 2-vi': row.cells[9].textContent
        }));

        // Submit to Larkbase với input string
        await TableDraftTracking.trackDraftGeneration(
            inputDataTemp,
            rawResponseTemp,
            finalTableData
        );

        console.log('Data submitted to Larkbase:', {
            input: inputDataTemp,
            raw: rawResponseTemp,
            final: finalTableData
        });

    } catch (error) {
        console.error('Error in copyTableToClipboard:', error);
        alert('Error copying table: ' + error.message);
    }
}

function openEditDialog(lesson, index) {
    const dialog = createEditDialog(lesson);
    document.body.appendChild(dialog);
    addEditDialogListeners(dialog, lesson, index);
}

function createEditDialog(lesson) {
    const dialog = document.createElement('div');
    dialog.className = 'edit-dialog';
    dialog.innerHTML = `
        <div class="dialog-content">
            <h3>Edit Lesson</h3>
            <label for="edit-question">Question:</label>
            <input type="text" id="edit-question" value="${lesson.question}">
            
            <label for="edit-structure">Structure:</label>
            <input type="text" id="edit-structure" value="${lesson.structure}">
            
            <label for="edit-main-phrase">Main Phrase:</label>
            <input type="text" id="edit-main-phrase" value="${lesson['main phrase']}">
            
            <label for="edit-optional1">Alternative Option 1:</label>
            <input type="text" id="edit-optional1" value="${lesson['optional phrase 1']}">
            
            <label for="edit-optional2">Alternative Option 2:</label>
            <input type="text" id="edit-optional2" value="${lesson['optional phrase 2']}">
            
            <label for="edit-question-vi">Question (VI):</label>
            <input type="text" id="edit-question-vi" value="${lesson['question-vi']}">
            
            <label for="edit-structure-vi">Structure (VI):</label>
            <input type="text" id="edit-structure-vi" value="${lesson['structure-vi']}">
            
            <label for="edit-main-phrase-vi">Main Phrase (VI):</label>
            <input type="text" id="edit-main-phrase-vi" value="${lesson['main phrase-vi']}">
            
            <label for="edit-optional1-vi">Alternative Option 1 (VI):</label>
            <input type="text" id="edit-optional1-vi" value="${lesson['optional phrase 1-vi']}">
            
            <label for="edit-optional2-vi">Alternative Option 2 (VI):</label>
            <input type="text" id="edit-optional2-vi" value="${lesson['optional phrase 2-vi']}">
            
            <div class="dialog-buttons">
                <button id="save-edit">Save</button>
                <button id="cancel-edit">Cancel</button>
            </div>
        </div>
    `;
    return dialog;
}

function addEditDialogListeners(dialog, lesson, index) {
    document.getElementById('save-edit').addEventListener('click', () => {
        updateLesson(lesson);
        displayGeneratedQuestions(storagedLessons);
        document.body.removeChild(dialog);
    });

    document.getElementById('cancel-edit').addEventListener('click', () => {
        document.body.removeChild(dialog);
    });
}

function updateLesson(lesson) {
    lesson.question = document.getElementById('edit-question').value;
    lesson.structure = document.getElementById('edit-structure').value;
    lesson['main phrase'] = document.getElementById('edit-main-phrase').value;
    lesson['optional phrase 1'] = document.getElementById('edit-optional1').value;
    lesson['optional phrase 2'] = document.getElementById('edit-optional2').value;
    
    // Ensure Vietnamese translations are updated
    lesson['question-vi'] = document.getElementById('edit-question-vi').value;
    lesson['structure-vi'] = document.getElementById('edit-structure-vi').value;
    lesson['main phrase-vi'] = document.getElementById('edit-main-phrase-vi').value;
    lesson['optional phrase 1-vi'] = document.getElementById('edit-optional1-vi').value;
    lesson['optional phrase 2-vi'] = document.getElementById('edit-optional2-vi').value;
    
    // Xóa cache khi người dùng sửa bài học
    learningCache.invalidateForNewLesson();
    
    // Cập nhật cả 4 modules học tập dựa trên dữ liệu mới
    regenerateAllLearningModules();
}

// Thêm hàm mới để tạo lại tất cả các module học tập
function regenerateAllLearningModules() {
    setTimeout(() => {
        // Truyền trực tiếp storagedLessons cho các module
        generateLearningMeaning(storagedLessons);
        generateLearningCard(storagedLessons);
        generateLearningFlexible(storagedLessons);
        generateLearningQNA(storagedLessons);
        
        console.log('All learning modules have been refreshed with new question data');
    }, 300);
}

// Thêm hàm tạo unique ID
function generateUniqueId() {
    return 'lesson_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function addCopyButton(container, table) {
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy Table';
    copyButton.className = 'copy-btn';
    copyButton.addEventListener('click', async () => {
        try {
            await copyTableToClipboard(table);
        } catch (error) {
            console.error('Error copying table:', error);
            alert('Failed to copy table: ' + error.message);
        }
    });
    container.appendChild(copyButton);
}

export { 
    handleGenerateClick,
    storagedLessons,
    generateUniqueId,
    regenerateAllLearningModules
};



=========
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