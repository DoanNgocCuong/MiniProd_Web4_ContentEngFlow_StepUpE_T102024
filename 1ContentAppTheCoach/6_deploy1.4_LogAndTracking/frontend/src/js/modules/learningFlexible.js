import { config } from '../config.js';
import { showLoadingDialog, hideLoadingDialog } from '../utils.js';
import TableLearningFlexibleTracking from '../trackings/tableLearningFlexibleTracking.js';
import { storagedLessons, generateUniqueId } from '../generateQuestion.js';

const API_URL = config.production.apiUrl;
let learningFlexibleLessons = [];
let rawApiResponse;
let currentLessonId = null;

async function generateLearningFlexible(lessons) {
    try {
        currentLessonId = storagedLessons?.[0]?.lesson_id || generateUniqueId();

        const flexibleLessons = lessons.map(lesson => ({
            question: lesson.question || "Which company are you working for?",
            structure: lesson.structure || "I'm the ______ from ABC Company.",
            phrases: [
                lesson["main phrase"],
                lesson["optional phrase 1"],
                lesson["optional phrase 2"]
            ].filter(Boolean)
        }));

        showLoadingDialog();
        const response = await fetch(`${API_URL}/generate-learning-flexible`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lessons: flexibleLessons })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        rawApiResponse = data;
        learningFlexibleLessons = data.map(item => ({
            ...item,
            lesson_id: currentLessonId
        }));
        displayLearningFlexibleResults(learningFlexibleLessons);
    } catch (error) {
        console.error('Error generating flexible cards:', error);
        alert('Error generating flexible cards: ' + error.message);
    } finally {
        hideLoadingDialog();
    }
}

function displayLearningFlexibleResults(lessons) {
    try {
        if (!lessons || !Array.isArray(lessons)) {
            throw new Error('Invalid lessons data received');
        }
        
        const container = document.getElementById('flexible-phrase-container');
        container.innerHTML = '';
        
        const table = createLearningFlexibleTable(lessons);
        container.appendChild(table);

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Table';
        copyButton.className = 'copy-btn';
        copyButton.addEventListener('click', () => copyLearningFlexibleTable(table));
        container.appendChild(copyButton);

    } catch (error) {
        console.error('Error:', error.message);
        alert('Error displaying results: ' + error.message);
    }
}

function createLearningFlexibleTable(lessons) {
    const table = document.createElement('table');
    table.className = 'learning-flexible-table';
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    
    table.appendChild(createLearningFlexibleTableHeader());
    const tbody = document.createElement('tbody');
    
    lessons.forEach((lesson, index) => {
        const row = document.createElement('tr');
        const cells = [
            lesson.description || '',
            lesson.sentence_hide || '',
            lesson.sentence_en || '',
            lesson.sentence_vi || ''
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
        editButton.onclick = () => openLearningFlexibleEditDialog(lesson, index);
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.dataset.index = index;
        deleteButton.onclick = () => deleteLearningFlexibleLesson(index);
        
        editTd.appendChild(editButton);
        deleteTd.appendChild(deleteButton);
        row.appendChild(editTd);
        row.appendChild(deleteTd);
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    return table;
}

function createLearningFlexibleTableHeader() {
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Description</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Hidden Sentence</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">English Sentence</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Vietnamese Sentence</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Actions</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Actions</th>
        </tr>
    `;
    return thead;
}

function updateLearningFlexibleLesson(lesson) {
    lesson.description = document.getElementById('edit-description').value;
    lesson.sentence_hide = document.getElementById('edit-sentence-hide').value;
    lesson.sentence_en = document.getElementById('edit-sentence-en').value;
    lesson.sentence_vi = document.getElementById('edit-sentence-vi').value;
}

function openLearningFlexibleEditDialog(lesson, index) {
    const dialog = document.createElement('div');
    dialog.className = 'edit-dialog';
    dialog.innerHTML = `
        <div class="dialog-content">
            <h3>Edit Flexible Phrase</h3>
            <label for="edit-description">Description:</label>
            <input type="text" id="edit-description" value="${lesson.description || ''}">
            
            <label for="edit-sentence-hide">Hidden Sentence:</label>
            <input type="text" id="edit-sentence-hide" value="${lesson.sentence_hide || ''}">
            
            <label for="edit-sentence-en">English Sentence:</label>
            <input type="text" id="edit-sentence-en" value="${lesson.sentence_en || ''}">
            
            <label for="edit-sentence-vi">Vietnamese Sentence:</label>
            <input type="text" id="edit-sentence-vi" value="${lesson.sentence_vi || ''}">
            
            <div class="dialog-buttons">
                <button class="btn btn-primary" id="save-edit">Save</button>
                <button class="btn btn-secondary" id="cancel-edit">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    document.getElementById('save-edit').addEventListener('click', () => {
        updateLearningFlexibleLesson(lesson);
        learningFlexibleLessons[index] = lesson;
        displayLearningFlexibleResults(learningFlexibleLessons);
        document.body.removeChild(dialog);
    });

    document.getElementById('cancel-edit').addEventListener('click', () => {
        document.body.removeChild(dialog);
    });
}

function deleteLearningFlexibleLesson(index) {
    learningFlexibleLessons.splice(index, 1);
    displayLearningFlexibleResults(learningFlexibleLessons);
}

async function copyLearningFlexibleTable(table) {
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
            lessons: storagedLessons || [],
            raw: rawApiResponse,
            final: learningFlexibleLessons
        };

        // Log tracking data
        console.group('Learning Flexible Tracking');
        console.log('Tracking Data:', trackingData);
        console.log('Status: Ready to submit to Larkbase');
        console.groupEnd();

        // Submit tracking data
        await TableLearningFlexibleTracking.trackFlexibleGeneration(
            {
                lesson_id: currentLessonId,
                lessons: storagedLessons || []
            },
            rawApiResponse,
            learningFlexibleLessons
        );

        console.log('Data submitted to Larkbase:', trackingData);

    } catch (error) {
        console.error('Error copying table:', error);
        alert('Failed to copy table: ' + error.message);
    }
}

export { learningFlexibleLessons, generateLearningFlexible };