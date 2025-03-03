import { config } from '../config.js';
import { showLoadingDialog, hideLoadingDialog } from '../utils.js';
import TableLearningCardTracking from '../trackings/tableLearningCardTracking.js';
import { generateUniqueId } from '../generateQuestion.js';

const API_URL = config.production.apiUrl;
let learningCardLessons = [];
let rawApiResponse;
let currentLessonId = null;

async function generateLearningCard(lessons) {
    try {
        console.log('Generating learning cards with edited lessons:', lessons);

        if (!lessons || !Array.isArray(lessons) || lessons.length === 0) {
            throw new Error('Invalid lessons data');
        }

        currentLessonId = lessons[0]?.lesson_id || generateUniqueId();

        showLoadingDialog();
        const response = await fetch(`${API_URL}/generate-learning-card`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lessons: lessons })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data || !Array.isArray(data)) {
            throw new Error('Invalid response format from server');
        }

        rawApiResponse = data;
        learningCardLessons = data.map(item => ({
            ...item,
            lesson_id: currentLessonId
        }));
        displayLearningCardResults(learningCardLessons);
    } catch (error) {
        console.error('Error in generateLearningCard:', error);
        alert(`Error generating learning cards: ${error.message}`);
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

async function copyLearningCardTable(table) {
    try {
        if (!currentLessonId) {
            throw new Error('No lesson ID found. Please generate questions first.');
        }

        // Existing copy logic
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
        
        tempTable.appendChild(tbody);
        tempTable.style.position = 'absolute';
        tempTable.style.left = '-9999px';
        document.body.appendChild(tempTable);
        
        const range = document.createRange();
        range.selectNode(tempTable);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        
        // Alert copy success first
        alert('Table copied to clipboard!');

        // Clean up
        window.getSelection().removeAllRanges();
        document.body.removeChild(tempTable);

        // Prepare tracking data
        const trackingData = {
            lesson_id: currentLessonId,
            lessons: learningCardLessons,
            raw: rawApiResponse,
            final: learningCardLessons
        };

        // Log tracking data
        console.group('Learning Card Tracking');
        console.log('Tracking Data:', trackingData);
        console.log('Status: Ready to submit to Larkbase');
        console.groupEnd();

        // Submit tracking data
        await TableLearningCardTracking.trackCardGeneration(
            {
                lesson_id: currentLessonId,
                lessons: learningCardLessons
            },
            rawApiResponse,
            learningCardLessons
        );

        console.log('Data submitted to Larkbase:', trackingData);

    } catch (error) {
        console.error('Error copying table:', error);
        alert('Failed to copy table: ' + error.message);
    }
}

// Add this function for copyCheckedLessons
function copyCheckedLessons() {
    // This function will be called when the copy button is clicked
    // You can implement the logic to copy selected lessons here
    console.log('Copy checked lessons functionality to be implemented');
}



/**
 * ---------------------------------------------------------------------------------------------------------
 * Generate Learning Flexible
 * ---------------------------------------------------------------------------------------------------------
 */
// export biến global ra ngoài để sử dụng ở ngoài
export { learningCardLessons, generateLearningCard };