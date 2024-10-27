// Fetch OpenAI API key from environment or use a stored one
const apiKey = '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';

let storagedLessons;
let learningMeaningLessons = [];
let learningCardLessons = [];

/**
 * ---------------------------------------------------------------------------------------------------------
 * Event Listeners and Initialization
 * ---------------------------------------------------------------------------------------------------------
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    document.getElementById('generate-btn').addEventListener('click', handleGenerateClick);
    // document.getElementById('draft-btn').addEventListener('click', handleDownloadDraft);
    // initializeExerciseButtons();
    document.getElementById('copy-selected-lessons').addEventListener('click', copyCheckedLessons);
});

function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            updateTabState(tabBtns, tabContents, tabId);
        });
    });
}

function updateTabState(tabBtns, tabContents, activeTabId) {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    const activeBtn = Array.from(tabBtns).find(b => b.getAttribute('data-tab') === activeTabId);
    const activeContent = Array.from(tabContents).find(content => content.id === activeTabId);

    if (activeBtn && activeContent) {
        activeBtn.classList.add('active');
        activeContent.classList.add('active');
    }
}

/**
 * ---------------------------------------------------------------------------------------------------------
 * Question Generation
 * ---------------------------------------------------------------------------------------------------------
 */

function handleGenerateClick() {
    const activeTab = document.querySelector('.tab-content.active');
    const prompt = activeTab.id === 'standard-form' ? createGenerateQuestionPrompt() : document.getElementById('custom-prompt-text').value;
    generateQuestions(prompt);
}



function createGenerateQuestionPrompt() {
    const topic = document.getElementById('topic').value;
    const level = document.getElementById('level').value;
    const questionCount = document.getElementById('question-count').value;
    const extraRequirements = document.getElementById('extra-requirements').value;

    return `Generate ${questionCount} questions for an English lesson on the topic "${topic}" at the ${level} level, following any additional requirements: ${extraRequirements}.
            Each question should follow this dictionary format and ensure that the 'structure' and 'structure-vi' include a blank space (____) where the answer will fit:
                'question': 'Your question text here',
                'structure': 'Answer structure here with a blank (____)',
                'main phrase': 'Phrase to fill in the blank',
                'optional phrase 1': 'Alternative phrase option 1',
                'optional phrase 2': 'Alternative phrase option 2',
                'question-vi': 'Vietnamese translation of question here',
                'structure-vi': 'Vietnamese translation of answer structure with blank (____)',
                'main phrase-vi': 'Vietnamese translation of main phrase',
                'optional phrase 1-vi': 'Vietnamese translation of option 1',
                'optional phrase 2-vi': 'Vietnamese translation of option 2'.

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
        const response = await fetch('http://localhost:3000/api/generate-questions', {
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

// Show loading dialog
function showLoadingDialog() {
    const loadingDialog = document.getElementById('loading-dialog');
    loadingDialog.style.display = 'flex'; // Show the dialog
}

function processApiResponse(data) {
    try {
        console.log('Raw API response:', data);
        
        // Kiểm tra nếu data là array
        if (Array.isArray(data)) {
            storagedLessons = data;
            displayGeneratedQuestions(data);
            return;
        }
        
        // Nếu không phải array, thử parse từ content
        if (data.choices && data.choices[0] && data.choices[0].message) {
            const content = data.choices[0].message.content;
            console.log('Content from API:', content);
            
            // Clean và parse JSON
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
    // Tạo bảng tm thời để copy
    const tempTable = document.createElement('table');
    
    // Copy header (loại bỏ 2 cột Action)
    const headerRow = table.querySelector('thead tr');
    const newHeader = document.createElement('thead');
    const newHeaderRow = document.createElement('tr');
    
    // Copy tất cả cells từ header, trừ 2 cột cuối
    for (let i = 0; i < headerRow.cells.length - 2; i++) {
        const cell = headerRow.cells[i].cloneNode(true);
        newHeaderRow.appendChild(cell);
    }
    newHeader.appendChild(newHeaderRow);
    tempTable.appendChild(newHeader);
    
    // Copy body (loại bỏ 2 cột Action)
    const tbody = document.createElement('tbody');
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const newRow = document.createElement('tr');
        // Copy tất cả cells từ mỗi row, trừ 2 cột cuối
        for (let i = 0; i < row.cells.length - 2; i++) {
            const cell = row.cells[i].cloneNode(true);
            newRow.appendChild(cell);
        }
        tbody.appendChild(newRow);
    });
    
    tempTable.appendChild(tbody);
    
    // Thêm bảng tạm thời vào document (ẩn)
    tempTable.style.position = 'absolute';
    tempTable.style.left = '-9999px';
    document.body.appendChild(tempTable);
    
    // Copy nội dung
    const range = document.createRange();
    range.selectNode(tempTable);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    
    // Xóa bảng tạm thời
    document.body.removeChild(tempTable);
    
    // Thông báo
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

/**
 * ---------------------------------------------------------------------------------------------------------
 * CSV Generation and Download
 * ---------------------------------------------------------------------------------------------------------
 */

function convertToCSV(objArray) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    const headers = ["Question", "Structure", "Main phrase", "Optional phrase 1", "Optional phrase 2",
        "Question (VI)", "Structure (VI)", "Main phrase (VI)", "Optional phrase 1 (VI)", "Optional phrase 2 (VI)"];
    const csvRows = [headers.join(',')];

    array.forEach(lesson => {
        const row = [
            lesson.question,
            lesson.structure,
            lesson['main phrase'],
            lesson['optional phrase 1'],
            lesson['optional phrase 2'],
            lesson['question-vi'],
            lesson['structure-vi'],
            lesson['main phrase-vi'],
            lesson['optional phrase 1-vi'],
            lesson['optional phrase 2-vi']
        ].map(cell => `"${cell.replace(/"/g, '""')}"`);
        csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


/**
 * ---------------------------------------------------------------------------------------------------------
 * Exercise Generation
 * ---------------------------------------------------------------------------------------------------------
 */
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and hide all content
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Add active class to the clicked button and show the corresponding content
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');

        // Call the appropriate function based on the tab clicked
        if (tabId === 'learning-meaning') {
            generateLearningMeaning(storagedLessons); // Call the function for Learning Meaning
        } else if (tabId === 'learning-card') {
            generateLearningCard(storagedLessons); // Call the function for Learning Card
        } else if (tabId === 'flexible-phrase') {
            generateFlexiblePhrase(); // Call the function for Flexible Phrase
        } else if (tabId === 'qa') {
            generateQA(); // Call the function for Q&A
        }
    });
});


/**
 * ---------------------------------------------------------------------------------------------------------
 * Generate Learning Meaning
 * ---------------------------------------------------------------------------------------------------------
 */

// Define system prompt as a constant
const LEARNING_MEANING_PROMPT = `**Prompt:**  
You are an expert at creating English exercise content. You will receive \`CẤU TRÚC\`, \`MAIN PHRASE\`, and \`OTHER PHRASE\` inputs from the user.

**Instructions:**  
1. For each phrase:
   - Use \`answer_1\` as the exact \`MAIN PHRASE\` or \`OTHER PHRASE\`.
   - Provide alternatives for \`answer_2\` and \`answer_3\` with phrases close in meaning but incorrect.
2. For each incorrect answer:
   - Give a description explaining why it is incorrect, highlighting incorrect words with \`<r>...</r>\` tags.

**Response Format:** Output only in JSON format with no extra characters (not include \`\`\`json).

**Example Input:**  
{
    "structure": "I'm the ______ from ABC Company.",
    "mainPhrase": "Sales representative",
    "optionalPhrase": "Sales director"
}

**Expected Output:**
[
    {
        "sentence": "I'm the <g>Đại diện kinh doanh</g> from ABC Company.",
        "_comment": "MAIN PHRASE",
        "answer_1": "Sales representative",
        "answer_2": "Business representative",
        "answer_3": "Sales agent",
        "answer_2_description": "<r>Business representative</r> không hoàn toàn đúng vì 'Business representative' thường mang nghĩa rộng hơn 'Đại diện kinh doanh', không chuyên biệt cho mảng bán hàng.",
        "answer_3_description": "<r>Sales agent</r> không hoàn toàn chính xác vì 'Sales agent' thường được dùng cho vai trò đại diện bán hàng theo hợp đồng, không bao hàm toàn bộ công việc của một 'Sales representative'."
    },
    {
        "sentence": "I'm the <g>Giám đốc kinh doanh</g> from ABC Company.",
        "_comment": "OTHER PHRASE",
        "answer_1": "Sales director",
        "answer_2": "Sales manager",
        "answer_3": "Commercial director",
        "answer_2_description": "<r>Sales manager</r> không hoàn toàn đúng vì 'Sales manager' mang nghĩa là 'Quản lý kinh doanh' thay vì 'Giám đốc kinh doanh', thể hiện cấp bậc thấp hơn trong cấu trúc công ty.",
        "answer_3_description": "<r>Commercial director</r> không chính xác vì 'Commercial director' quản lý các hoạt động thương mại nói chung, không chuyên biệt về kinh doanh hoặc bán hàng."
    }
]`;

// Update Learning Meaning generation
async function generateLearningMeaning(storagedLessons) {
    try {
        showLoadingDialog();
        const response = await fetch('http://localhost:3000/api/generate-learning-meaning', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ lessons: storagedLessons })
        });
        const data = await response.json();
        learningMeaningLessons = data;
        displayLearningMeaningResults(data);
    } catch (error) {
        alert(error.message);
        console.error('Error:', error.message);
    } finally {
        hideLoadingDialog();
    }
}

function updateLearningMeaningLesson(lesson) {
    lesson.sentence = document.getElementById('edit-sentence').value;
    lesson.answer_1 = document.getElementById('edit-answer1').value;
    lesson.answer_2 = document.getElementById('edit-answer2').value;
    lesson.answer_3 = document.getElementById('edit-answer3').value;
    lesson.answer_2_description = document.getElementById('edit-answer2-desc').value;
    lesson.answer_3_description = document.getElementById('edit-answer3-desc').value;
}

function openLearningMeaningEditDialog(lesson, index) {
    const dialog = createLearningMeaningEditDialog(lesson);
    document.body.appendChild(dialog);
    addLearningMeaningEditDialogListeners(dialog, lesson, index);
}

function createLearningMeaningEditDialog(lesson) {
    const dialog = document.createElement('div');
    dialog.className = 'edit-dialog';
    dialog.innerHTML = `
        <div class="dialog-content">
            <h3>Edit Learning Meaning</h3>
            <label for="edit-sentence">Sentence:</label>
            <input type="text" id="edit-sentence" value="${lesson.sentence || ''}">
            
            <label for="edit-answer1">Answer 1:</label>
            <input type="text" id="edit-answer1" value="${lesson.answer_1 || ''}">
            
            <label for="edit-answer2">Answer 2:</label>
            <input type="text" id="edit-answer2" value="${lesson.answer_2 || ''}">
            
            <label for="edit-answer3">Answer 3:</label>
            <input type="text" id="edit-answer3" value="${lesson.answer_3 || ''}">
            
            <label for="edit-answer2-desc">Answer 2 Description:</label>
            <textarea id="edit-answer2-desc">${lesson.answer_2_description || ''}</textarea>
            
            <label for="edit-answer3-desc">Answer 3 Description:</label>
            <textarea id="edit-answer3-desc">${lesson.answer_3_description || ''}</textarea>
            
            <div class="dialog-buttons">
                <button id="save-edit">Save</button>
                <button id="cancel-edit">Cancel</button>
            </div>
        </div>
    `;
    return dialog;
}

function addLearningMeaningEditDialogListeners(dialog, lesson, index) {
    document.getElementById('save-edit').addEventListener('click', () => {
        updateLearningMeaningLesson(lesson);
        // Cập nhật lại mảng dữ liệu gốc
        learningMeaningLessons[index] = lesson;
        displayLearningMeaningResults(learningMeaningLessons);
        document.body.removeChild(dialog);
    });

    document.getElementById('cancel-edit').addEventListener('click', () => {
        document.body.removeChild(dialog);
    });
}

// Sửa lại hàm deleteLearningMeaningLesson
function deleteLearningMeaningLesson(index, lessons) {
    if (confirm('Are you sure you want to delete this item?')) {
        // Xóa chính xác 1 dòng tại index được chọn
        learningMeaningLessons.splice(index, 1);
        
        // Cập nhật lại hiển thị
        displayLearningMeaningResults(learningMeaningLessons);
    }
}

// Hàm hiển thị kết quả học nghĩa
function displayLearningMeaningResults(lessons) {
    try {
        if (!lessons || !Array.isArray(lessons)) {
            throw new Error('Invalid lessons data received');
        }
        
        const container = document.getElementById('learning-meaning-container'); 
        container.textContent = '';
        
        // Create and add table
        const table = createLearningMeaningTable(lessons);
        container.appendChild(table);

        // Add copy button
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Table';
        copyButton.className = 'copy-btn';
        copyButton.addEventListener('click', () => copyLearningMeaningTable(table));
        container.appendChild(copyButton);

    } catch (error) {
        console.error('Error:', error.message);
        alert('Error displaying results: ' + error.message);
    }
}

function copyLearningMeaningTable(table) {
    // Create temporary table for copying
    const tempTable = document.createElement('table');
    
    // Copy header (excluding Action columns)
    const headerRow = table.querySelector('thead tr');
    const newHeader = document.createElement('thead');
    const newHeaderRow = document.createElement('tr');
    
    // Copy all cells except the last two (Action columns)
    for (let i = 0; i < headerRow.cells.length - 2; i++) {
        const cell = headerRow.cells[i].cloneNode(true);
        newHeaderRow.appendChild(cell);
    }
    newHeader.appendChild(newHeaderRow);
    tempTable.appendChild(newHeader);
    
    // Copy body (excluding Action columns)
    const tbody = document.createElement('tbody');
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const newRow = document.createElement('tr');
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

// Hàm tạo bảng hiển thị kết quả học nghĩa
function createLearningMeaningTable(lessons) {
    const table = document.createElement('table');
    table.className = 'learning-meaning-table';
    table.appendChild(createLearningMeaningTableHeader());
    
    const tbody = document.createElement('tbody');
    
    for(let i = 0; i < lessons.length; i += 2) {
        // Main phrase row
        const mainPhraseRow = document.createElement('tr');
        const mainCells = [
            'Hãy dịch cụm in đậm',
            lessons[i].sentence,          // Giữ nguyên các thẻ <g>, <r>
            lessons[i].answer_1,
            lessons[i].answer_2,
            lessons[i].answer_3,
            lessons[i].answer_2_description,  // Giữ nguyên các thẻ <r>
            lessons[i].answer_3_description   // Giữ nguyên các thẻ <r>
        ];
        
        mainCells.forEach(content => {
            const td = document.createElement('td');
            td.textContent = content || ''; 
            mainPhraseRow.appendChild(td);
        });

        // Thêm nút Edit và Delete
        const editTd = document.createElement('td');
        const deleteTd = document.createElement('td');
        
        const editButton = document.createElement('button');
        editButton.className = 'edit-btn';
        editButton.textContent = 'Edit';
        editButton.dataset.index = i;
        editButton.onclick = () => openLearningMeaningEditDialog(lessons[i], i);
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.dataset.index = i;
        deleteButton.onclick = () => deleteLearningMeaningLesson(i, lessons);
        
        editTd.appendChild(editButton);
        deleteTd.appendChild(deleteButton);
        mainPhraseRow.appendChild(editTd);
        mainPhraseRow.appendChild(deleteTd);
        
        tbody.appendChild(mainPhraseRow);

        // Optional phrase row
        if (lessons[i + 1]) {
            const optionalPhraseRow = document.createElement('tr');
            const optionalCells = [
                'Hãy dịch cụm in đậm',
                lessons[i + 1].sentence,          // Giữ nguyên các thẻ <g>, <r>
                lessons[i + 1].answer_1,
                lessons[i + 1].answer_2,
                lessons[i + 1].answer_3,
                lessons[i + 1].answer_2_description,  // Giữ nguyên các thẻ <r>
                lessons[i + 1].answer_3_description   // Giữ nguyên các thẻ <r>
            ];
            
            optionalCells.forEach(content => {
                const td = document.createElement('td');
                td.textContent = content || ''; // Dùng textContent thay vì innerHTML để giữ nguyên các thẻ <g>, <r>
                optionalPhraseRow.appendChild(td);
            });

            // Thêm nút Edit và Delete cho optional phrase
            const optEditTd = document.createElement('td');
            const optDeleteTd = document.createElement('td');
            
            const optEditButton = document.createElement('button');
            optEditButton.className = 'edit-btn';
            optEditButton.textContent = 'Edit';
            optEditButton.dataset.index = i + 1;
            optEditButton.onclick = () => openLearningMeaningEditDialog(lessons[i + 1], i + 1);
            
            const optDeleteButton = document.createElement('button');
            optDeleteButton.className = 'delete-btn';
            optDeleteButton.textContent = 'Delete';
            optDeleteButton.dataset.index = i + 1;
            optDeleteButton.onclick = () => deleteLearningMeaningLesson(i + 1, lessons);
            
            optEditTd.appendChild(optEditButton);
            optDeleteTd.appendChild(optDeleteButton);
            optionalPhraseRow.appendChild(optEditTd);
            optionalPhraseRow.appendChild(optDeleteTd);
            
            tbody.appendChild(optionalPhraseRow);
        }
    }
    
    table.appendChild(tbody);
    return table;
}
// Hàm tạo header cho bảng learning meaning - thêm 2 cột Actions
function createLearningMeaningTableHeader() {
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Description</th>
            <th>Sentence (EN)</th>
            <th>Answer 1</th>
            <th>Answer 2</th>
            <th>Answer 3</th>
            <th>Answer 2 Description</th>
            <th>Answer 3 Description</th>
            <th>Actions</th>
            <th>Actions</th>
        </tr>
    `;
    return thead;
}

/**
 * ---------------------------------------------------------------------------------------------------------
 * Generate Learning Card
 * ---------------------------------------------------------------------------------------------------------
 */
// Định nghĩa hệ thống prompt
const LEARNING_CARD_PROMPT = `**Prompt:**
You are an expert at creating English learning cards. Generate learning cards based on the provided structure and phrases.

**Response Format:** 
Return an array of learning card objects in JSON format with the following structure:
{
    "card_front": "English phrase or sentence",
    "card_back": "Vietnamese translation",
    "example_en": "Example sentence in English",
    "example_vi": "Example sentence in Vietnamese"
}

Do not include \`\`\`json or any extra characters in the response.`;

// Update Learning Card generation 
async function generateLearningCard(lessons) {
    try {
        showLoadingDialog();
        const response = await fetch('http://localhost:3000/api/generate-learning-card', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ lessons })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!Array.isArray(data)) {
            throw new Error('Invalid response format: expected an array');
        }
        
        learningCardLessons = data;
        displayLearningCardResults(data);
    } catch (error) {
        console.error('Error generating learning cards:', error);
        alert('Error generating learning cards: ' + error.message);
    } finally {
        hideLoadingDialog();
    }
}

function displayLearningCardResults(lessons) {
    try {
        if (!lessons || !Array.isArray(lessons)) {
            throw new Error('Invalid lessons data received');
        }
        
        const container = document.getElementById('learning-card-container'); 
        container.innerHTML = '';
        
        const table = createLearningCardTable(lessons);
        container.appendChild(table);

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Table';
        copyButton.className = 'copy-btn';
        copyButton.addEventListener('click', () => copyLearningCardTable(table));
        container.appendChild(copyButton);

    } catch (error) {
        console.error('Error:', error.message);
        alert('Error displaying results: ' + error.message);
    }
}

function createLearningCardTable(lessons) {
    const table = document.createElement('table');
    table.className = 'learning-card-table';
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    
    table.appendChild(createLearningCardTableHeader());
    const tbody = document.createElement('tbody');
    
    lessons.forEach((lesson, index) => {
        const row = document.createElement('tr');
        const cells = [
            lesson.sentence_en || '',
            lesson.sentence_vi || '',
            lesson.ipa || ''
        ];
        
        cells.forEach(content => {
            const td = document.createElement('td');
            td.textContent = content;
            td.style.border = '1px solid #ddd';
            td.style.padding = '8px';
            row.appendChild(td);
        });

        const editTd = document.createElement('td');
        const deleteTd = document.createElement('td');
        editTd.style.border = '1px solid #ddd';
        deleteTd.style.border = '1px solid #ddd';
        
        const editButton = document.createElement('button');
        editButton.className = 'edit-btn';
        editButton.textContent = 'Edit';
        editButton.dataset.index = index;
        editButton.onclick = () => openLearningCardEditDialog(lesson, index);
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.dataset.index = index;
        deleteButton.onclick = () => deleteLearningCardLesson(index, lessons);
        
        editTd.appendChild(editButton);
        deleteTd.appendChild(deleteButton);
        row.appendChild(editTd);
        row.appendChild(deleteTd);
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    return table;
}

function createLearningCardTableHeader() {
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Sentence (EN)</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Sentence (VI)</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">IPA</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Actions</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Actions</th>
        </tr>
    `;
    return thead;
}

function updateLearningCardLesson(lesson) {
    lesson.sentence_en = document.getElementById('edit-sentence-en').value;
    lesson.sentence_vi = document.getElementById('edit-sentence-vi').value;
    lesson.ipa = document.getElementById('edit-ipa').value;
}

function openLearningCardEditDialog(lesson, index) {
    const dialog = document.createElement('div');
    dialog.className = 'edit-dialog';
    dialog.innerHTML = `
        <div class="dialog-content">
            <h3>Edit Learning Card</h3>
            <label for="edit-sentence-en">English Sentence:</label>
            <input type="text" id="edit-sentence-en" value="${lesson.sentence_en || ''}">
            
            <label for="edit-sentence-vi">Vietnamese Sentence:</label>
            <input type="text" id="edit-sentence-vi" value="${lesson.sentence_vi || ''}">
            
            <label for="edit-ipa">IPA:</label>
            <input type="text" id="edit-ipa" value="${lesson.ipa || ''}">
            
            <div class="dialog-buttons">
                <button class="btn btn-primary" id="save-edit">Save</button>
                <button class="btn btn-secondary" id="cancel-edit">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    document.getElementById('save-edit').addEventListener('click', () => {
        updateLearningCardLesson(lesson);
        learningCardLessons[index] = lesson;
        displayLearningCardResults(learningCardLessons);
        document.body.removeChild(dialog);
    });

    document.getElementById('cancel-edit').addEventListener('click', () => {
        document.body.removeChild(dialog);
    });
}

function deleteLearningCardLesson(index) {
    if (confirm('Are you sure you want to delete this item?')) {
        learningCardLessons.splice(index, 1);
        displayLearningCardResults(learningCardLessons);
    }
}

// Add this function for copyCheckedLessons
function copyCheckedLessons() {
    // This function will be called when the copy button is clicked
    // You can implement the logic to copy selected lessons here
    console.log('Copy checked lessons functionality to be implemented');
}

// Add this function for hideLoadingDialog
function hideLoadingDialog() {
    const loadingDialog = document.getElementById('loading-dialog');
    loadingDialog.style.display = 'none'; // Hide the dialog
}

















