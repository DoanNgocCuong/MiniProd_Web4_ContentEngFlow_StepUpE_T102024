import { config } from '../../config.js';
import { showLoadingDialog, hideLoadingDialog, updateLoadingProgress } from '../../utils.js';
import TableLearningQNATracking from '../../trackings/tableLearningQNATracking.js';
import { storagedLessons, generateUniqueId } from '../../generateQuestion.js';
import learningCache from './cache.js';

const API_URL = config.production.apiUrl;
let learningQNALessons = [];
let rawApiResponse;
let currentLessonId = null;

async function generateLearningQNA(lessons) {
    try {
        currentLessonId = storagedLessons?.[0]?.lesson_id || generateUniqueId();

        // Check cache first
        const cachedData = learningCache.get('qna', currentLessonId);
        if (cachedData) {
            console.log('Using cached Learning QNA data');
            rawApiResponse = cachedData;
            learningQNALessons = cachedData.map(item => ({
                ...item,
                lesson_id: currentLessonId
            }));
            displayLearningQNAResults(learningQNALessons);
            return;
        }

        console.log('No cache found, generating new Learning QNA data');
        showLoadingDialog();
        updateLoadingProgress(10);
        
        const response = await fetch(`${API_URL}/generate-learning-qna`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lessons })
        });
        
        updateLoadingProgress(70);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        updateLoadingProgress(90);
        
        rawApiResponse = data;
        learningQNALessons = data.map(item => ({
            ...item,
            lesson_id: currentLessonId
        }));
        
        // Store in cache
        learningCache.set('qna', data, currentLessonId);
        
        displayLearningQNAResults(learningQNALessons);
        updateLoadingProgress(100);
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    } finally {
        hideLoadingDialog();
    }
}

function displayLearningQNAResults(lessons) {
    try {
        if (!lessons || !Array.isArray(lessons)) {
            throw new Error('Invalid lessons data received');
        }
        
        const container = document.getElementById('learning-qna-container');
        container.innerHTML = '';
        
        const table = createLearningQNATable(lessons);
        container.appendChild(table);

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Table';
        copyButton.className = 'copy-btn';
        copyButton.addEventListener('click', () => copyLearningQNATable(table));
        container.appendChild(copyButton);

    } catch (error) {
        console.error('Error:', error.message);
        alert('Error displaying results: ' + error.message);
    }
}

function createLearningQNATable(lessons) {
    const table = document.createElement('table');
    table.className = 'learning-qna-table';
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    
    table.appendChild(createLearningQNATableHeader());
    const tbody = document.createElement('tbody');
    
    lessons.forEach((lesson, index) => {
        const row = document.createElement('tr');
        const cells = [
            lesson.description || '',
            lesson.sentence_en || '',
            lesson.sentence_hide || ''
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
        editButton.onclick = () => openLearningQNAEditDialog(lesson, index);
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.dataset.index = index;
        deleteButton.onclick = () => deleteLearningQNALesson(index);
        
        editTd.appendChild(editButton);
        deleteTd.appendChild(deleteButton);
        row.appendChild(editTd);
        row.appendChild(deleteTd);
        
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    return table;
}

function createLearningQNATableHeader() {
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Description</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">English Sentence</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Hidden Sentence</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Actions</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Actions</th>
        </tr>
    `;
    return thead;
}

function updateLearningQNALesson(lesson) {
    lesson.description = document.getElementById('edit-description').value;
    lesson.sentence_en = document.getElementById('edit-sentence-en').value;
    lesson.sentence_hide = document.getElementById('edit-sentence-hide').value;
}

function openLearningQNAEditDialog(lesson, index) {
    const dialog = document.createElement('div');
    dialog.className = 'edit-dialog';
    dialog.innerHTML = `
        <div class="dialog-content">
            <h3>Edit QNA Lesson</h3>
            <label for="edit-description">Description:</label>
            <input type="text" id="edit-description" value="${lesson.description || ''}">
            
            <label for="edit-sentence-en">English Sentence:</label>
            <input type="text" id="edit-sentence-en" value="${lesson.sentence_en || ''}">
            
            <label for="edit-sentence-hide">Hidden Sentence:</label>
            <input type="text" id="edit-sentence-hide" value="${lesson.sentence_hide || ''}">
            
            <div class="dialog-buttons">
                <button class="btn btn-primary" id="save-edit">Save</button>
                <button class="btn btn-secondary" id="cancel-edit">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    document.getElementById('save-edit').addEventListener('click', () => {
        updateLearningQNALesson(lesson);
        learningQNALessons[index] = lesson;
        displayLearningQNAResults(learningQNALessons);
        document.body.removeChild(dialog);
    });

    document.getElementById('cancel-edit').addEventListener('click', () => {
        document.body.removeChild(dialog);
    });
}

function deleteLearningQNALesson(index) {
    // Xóa trực tiếp không cần confirm
    learningQNALessons.splice(index, 1);
    displayLearningQNAResults(learningQNALessons);
}

async function copyLearningQNATable(table) {
    try {
        if (!currentLessonId) {
            throw new Error('No lesson ID found. Please generate questions first.');
        }

        // Tạo bảng tạm thời chỉ có tbody
        const tempTable = document.createElement('table');
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
        
        // Chỉ thêm tbody vào tempTable
        tempTable.appendChild(tbody);
        tempTable.style.position = 'absolute';
        tempTable.style.left = '-9999px';
        document.body.appendChild(tempTable);
        
        const range = document.createRange();
        range.selectNode(tempTable);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        
        // Phần còn lại giữ nguyên
        // ...
    } catch (error) {
        console.error('Error copying table:', error);
        alert('Failed to copy table: ' + error.message);
    }
}

export { learningQNALessons, generateLearningQNA };