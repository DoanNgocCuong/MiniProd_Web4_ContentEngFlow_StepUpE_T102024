// frontend/src/js/generateQuestion.js

import { config } from './config.js';
import { showLoadingDialog, hideLoadingDialog } from './utils.js'; // if you moved these functions to utils.js

// Get the current environment's API URL
const API_URL = config.production.apiUrl; // or development/dockerInternal as needed

let storagedLessons;
let currentLessonId = null;

/**
 * ---------------------------------------------------------------------------------------------------------
 * Question Generation
 * ---------------------------------------------------------------------------------------------------------
 */

function handleGenerateClick() {
    // Generate a unique lesson ID
    currentLessonId = 'lesson_' + Date.now();
    
    const activeTab = document.querySelector('.tab-content.active');
    const prompt = activeTab.id === 'standard-form' ? createGenerateQuestionPrompt() : document.getElementById('custom-prompt-text').value;
    generateQuestions(prompt);
}

function createGenerateQuestionPrompt() {
    const topic = document.getElementById('topic').value;
    const level = document.getElementById('level').value;
    const questionCount = document.getElementById('question-count').value;
    const extraRequirements = document.getElementById('extra-requirements').value;

    return `Generate ${questionCount} English lesson questions on "${topic}" at ${level} level, 
and MUST meet the following additional requirements: ${extraRequirements}. 

Instructions: 

{
  "question": "Question text",
  "structure": "Answer format with blank (____), ONLY 1 blank for the answer",
  "main phrase": "Key phrase to fit blank (no proper nouns and must be a phrase 1, 2, 3, 4 words)", 
  "optional phrase 1": "Alternative phrase option 1 (no proper nouns and must be a phrase 1, 2, 3, 4 words)",
  "optional phrase 2": "Alternative phrase option 2 (no proper nouns and must be a phrase 1, 2, 3, 4 words)",
  "question-vi": "Vietnamese translation of question",
  "structure-vi": "Vietnamese translation of structure",
  "main phrase-vi": "Vietnamese translation of main phrase",
  "optional phrase 1-vi": "Vietnamese translation of option 1",
  "optional phrase 2-vi": "Vietnamese translation of option 2"
}

Example:
{
  "question": "Which company are you working for?",
  "structure": "I'm the ____ from ABC Company.",
  "main phrase": "Sales representative",
  "optional phrase 1": "Sales director", 
  "optional phrase 2": "Sales associate",
  "question-vi": "Bạn đang làm việc cho công ty nào vậy?",
  "structure-vi": "Tôi là ____ từ công ty ABC.",
  "main phrase-vi": "Đại diện kinh doanh",
  "optional phrase 1-vi": "Giám đốc kinh doanh",
  "optional phrase 2-vi": "Nhân viên bán hàng"
}`;
}

async function generateQuestions(prompt) {
    try {
        showLoadingDialog();
        const response = await fetch(`${API_URL}/generate-questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });
        const data = await response.json();
        processApiResponse(data);
    } catch (error) {
        alert(error.message);
        console.error('Error:', error.message);
    } finally {
        hideLoadingDialog();
    }
}

function processApiResponse(data) {
    try {
        console.log('Raw API response:', data);

        if (Array.isArray(data)) {
            storagedLessons = data;
            displayGeneratedQuestions(data);
            return;
        }

        if (data.choices && data.choices[0] && data.choices[0].message) {
            const content = data.choices[0].message.content;
            console.log('Content from API:', content);

            const cleanedContent = content.trim().replace(/```json|```/g, '');
            const lessons = JSON.parse(cleanedContent);

            if (Array.isArray(lessons)) {
                storagedLessons = lessons;
                displayGeneratedQuestions(lessons);
            } else {
                throw new Error('Expected an array of lessons');
            }
        } else {
            throw new Error('Invalid API response structure');
        }
    } catch (error) {
        console.error('Error processing API response:', error);
        alert('Error processing response: ' + error.message);
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
    // Remove the lesson from the lessons array
    lessons.splice(index, 1);

    // Re-display the updated questions
    displayGeneratedQuestions(lessons);
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

function addCopyButton(container, table) {
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy Table';
    copyButton.className = 'copy-btn';
    copyButton.addEventListener('click', () => copyTableToClipboard(table));
    container.appendChild(copyButton);
}

function copyTableToClipboard(table) {
    const tempTable = document.createElement('table');
    
    // Skip header and only copy body
    const tbody = document.createElement('tbody');
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const newRow = document.createElement('tr');
        // Copy all cells except the last two (Action columns)
        for (let i = 0; i < row.cells.length - 2; i++) {
            const cell = row.cells[i].cloneNode(true);
            newRow.appendChild(cell);
        }
        tbody.appendChild(newRow);
    });
    
    tempTable.appendChild(tbody);
    
    // Add temporary table to document (hidden)
    tempTable.style.position = 'absolute';
    tempTable.style.left = '-9999px';
    document.body.appendChild(tempTable);
    
    // Copy content
    const range = document.createRange();
    range.selectNode(tempTable);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    
    // Remove temporary table
    document.body.removeChild(tempTable);
    
    alert('Table copied to clipboard!');
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
    lesson['question-vi'] = document.getElementById('edit-question-vi').value;
    lesson['structure-vi'] = document.getElementById('edit-structure-vi').value;
    lesson['main phrase-vi'] = document.getElementById('edit-main-phrase-vi').value;
    lesson['optional phrase 1-vi'] = document.getElementById('edit-optional1-vi').value;
    lesson['optional phrase 2-vi'] = document.getElementById('edit-optional2-vi').value;
}

export { 
    handleGenerateClick,
    storagedLessons,
    currentLessonId,
    generateQuestions,
    processApiResponse,
    // ... any other functions needed externally
};

