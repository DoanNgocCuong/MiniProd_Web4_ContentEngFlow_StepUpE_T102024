// generateQuestion.js

import { config } from './config.js';
import { showLoadingDialog, hideLoadingDialog } from './utils.js';
import TableDraftTracking from './trackings/tableDraftTracking.js';

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
    const activeTab = document.querySelector('.tab-content.active');
    const isStandardForm = activeTab.id === 'standard-form';

    try {
        if (isStandardForm) {
            inputDataTemp = {
                topic: document.getElementById('topic').value,
                level: document.getElementById('level').value,
                questionCount: document.getElementById('question-count').value,
                extraRequirements: document.getElementById('extra-requirements').value
            };

            const prompt = createGenerateQuestionPrompt();
            
            showLoadingDialog();
            const response = await fetch(`${API_URL}/generate-questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            });
            
            const data = await response.json();
            
            const processedData = await processApiResponse(data);
            rawResponseTemp = [...processedData];
            
            storagedLessons = processedData;

        } else {
            const prompt = document.getElementById('custom-prompt-text').value;
            generateQuestions(prompt);
        }
    } catch (error) {
        console.error('Error in handleGenerateClick:', error);
        alert(error.message);
    } finally {
        hideLoadingDialog();
    }
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

async function processApiResponse(data) {
    try {
        console.log('Raw API response:', data);

        let lessons;
        if (Array.isArray(data)) {
            lessons = data;
        } else if (data.choices && data.choices[0] && data.choices[0].message) {
            const content = data.choices[0].message.content;
            const cleanedContent = content.trim().replace(/```json|```/g, '');
            lessons = JSON.parse(cleanedContent);
        } else {
            throw new Error('Invalid API response structure');
        }

        // Thêm lesson_id vào tất cả lessons
        const lesson_id = TableDraftTracking.generateLessonId(inputDataTemp.topic);
        lessons = lessons.map(item => ({
            ...item,
            lesson_id: lesson_id
        }));

        displayGeneratedQuestions(lessons);
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

        // Extract current table data (final version after edits)
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

        // Submit to Larkbase
        await TableDraftTracking.trackDraftGeneration(
            inputDataTemp,      // Input form data
            rawResponseTemp,    // Version đầu tiên với đầy đủ câu hỏi
            finalTableData      // Version cuối (có thể ít câu hỏi hơn do đã xóa)
        );


        console.log('Data submitted to Larkbase:', {
            input: inputDataTemp,
            raw: rawResponseTemp,    // Full version
            final: finalTableData    // Edited/deleted version
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
    lesson['question-vi'] = document.getElementById('edit-question-vi').value;
    lesson['structure-vi'] = document.getElementById('edit-structure-vi').value;
    lesson['main phrase-vi'] = document.getElementById('edit-main-phrase-vi').value;
    lesson['optional phrase 1-vi'] = document.getElementById('edit-optional1-vi').value;
    lesson['optional phrase 2-vi'] = document.getElementById('edit-optional2-vi').value;
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
    generateQuestions,
    processApiResponse,
    generateUniqueId
};