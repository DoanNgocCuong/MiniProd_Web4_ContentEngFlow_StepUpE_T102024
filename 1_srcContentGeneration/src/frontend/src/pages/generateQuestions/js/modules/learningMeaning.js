import { config } from '../config.js';
import { showLoadingDialog, hideLoadingDialog, updateLoadingProgress } from '../utils.js';
import TableLearningMeaningTracking from '../trackings/tableLearningMeaningTracking.js';
import { storagedLessons, generateUniqueId } from '../generateQuestion.js';
import learningCache from './cache.js';

const API_URL = config.production.apiUrl;
let learningMeaningLessons = [];
let rawApiResponse;
let currentLessonId = null;

async function generateLearningMeaning(lessons) {
    console.log('API RESPONSE:', lessons);
    
    try {
        // Set lesson_id from input or generate new one
        currentLessonId = lessons[0]?.lesson_id || generateUniqueId();
        
        // CÁCH CUỐI CÙNG: Bỏ qua cache hoàn toàn cho module này
        // Luôn tạo mới từ API để đảm bảo các thẻ HTML hiển thị đúng
        
        showLoadingDialog();
        updateLoadingProgress(10);
        
        const response = await fetch(`${API_URL}/generate-learning-meaning`, {
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
        learningMeaningLessons = data;
        
        // Store in cache
        learningCache.set('meaning', data, currentLessonId);
        
        // Khi nhận dữ liệu từ API thành công, kiểm tra HTML tags
        if (data && data.length > 0 && data[0].sentence) {
            console.log('API response contains HTML tags:');
            console.log('Has <g> tag:', data[0].sentence.includes('<g>'));
            console.log('Has <r> tag:', data[0].sentence.includes('<r>'));
        }
        
        displayLearningMeaningResults(learningMeaningLessons);
        updateLoadingProgress(100);
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
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
  
  // Sửa lại hàm deleteLearningMeaningLesson - bỏ confirm
function deleteLearningMeaningLesson(index, lessons) {
    // Xóa chính xác 1 dòng tại index được chọn
    learningMeaningLessons.splice(index, 1);
    
    // Cập nhật lại hiển thị
    displayLearningMeaningResults(learningMeaningLessons);
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
  
async function copyLearningMeaningTable(table) {
    try {
        // Chỉ tạo một bảng có tbody, không có thead
        const tempTable = document.createElement('table');
        const tbody = document.createElement('tbody');
        
        // Chỉ lấy các hàng dữ liệu từ tbody
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const newRow = document.createElement('tr');
            // Bỏ qua 2 cột cuối (Edit/Delete)
            for (let i = 0; i < row.cells.length - 2; i++) {
                const cell = row.cells[i].cloneNode(true);
                newRow.appendChild(cell);
            }
            tbody.appendChild(newRow);
        });
        
        tempTable.appendChild(tbody);
        
        // Định vị bảng ngoài màn hình (ẩn)
        tempTable.style.position = 'absolute';
        tempTable.style.left = '-9999px';
        document.body.appendChild(tempTable);
        
        // Sao chép vào clipboard
        const range = document.createRange();
        range.selectNode(tempTable);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        
        alert('Table copied to clipboard!');
        window.getSelection().removeAllRanges();
        document.body.removeChild(tempTable);

        // Phần tracking giữ nguyên
        // ...
    } catch (error) {
        console.error('Error copying table:', error);
        alert('Failed to copy table: ' + error.message);
    }
}
  
  // Hàm tạo bảng hiển thị kết quả học nghĩa
function createLearningMeaningTable(lessons) {
    console.log('DATA TO RENDER:', lessons); // Xem dữ liệu chính xác trước khi render
    
    const table = document.createElement('table');
    table.className = 'learning-meaning-table';
    table.appendChild(createLearningMeaningTableHeader());
    
    const tbody = document.createElement('tbody');
    
    for(let i = 0; i < lessons.length; i++) {
        console.log(`Row ${i}:`, {
            answer1: lessons[i].answer_1,
            sentence: lessons[i].sentence
        });
        
        const row = document.createElement('tr');
        
        // Thay vì convert các thẻ sang HTML entities, mình sẽ hiển thị text thô
        const cells = [
            'Hãy dịch cụm in đậm',
            lessons[i].sentence,
            lessons[i].answer_1,
            lessons[i].answer_2,
            lessons[i].answer_3,
            lessons[i].answer_2_description,
            lessons[i].answer_3_description
        ];
        
        cells.forEach(content => {
            const td = document.createElement('td');
            
            // Hiển thị các thẻ HTML dưới dạng text thô - cách 1
            const textNode = document.createTextNode(content || '');
            td.appendChild(textNode);
            
            row.appendChild(td);
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
        row.appendChild(editTd);
        row.appendChild(deleteTd);
        
        tbody.appendChild(row);
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
  
export { learningMeaningLessons, generateLearningMeaning }; // export biến global ra ngoài để sử dụng ở ngoài

// Kiểm tra cách hiển thị thẻ <g> và <r>
function renderLearningMeaning(data) {
  const container = document.getElementById('learning-meaning-container');
  
  data.forEach(item => {
    const element = document.createElement('div');
    element.className = 'learning-item';
    
    // Tạo node text thay vì sử dụng innerHTML
    const sentenceDiv = document.createElement('div');
    sentenceDiv.className = 'sentence';
    sentenceDiv.textContent = item.sentence; // Sử dụng textContent thay vì innerHTML
    
    const answerDiv = document.createElement('div');
    answerDiv.className = 'answer';
    answerDiv.textContent = item.answer_1;
    
    element.appendChild(sentenceDiv);
    element.appendChild(answerDiv);
    
    container.appendChild(element);
  });
}

// Thêm kiểm tra trong cache.js để xem dữ liệu có bị thay đổi không
function storeLearningMeaningInCache(data) {
    console.log('BEFORE STORING IN CACHE:', JSON.stringify(data));
    localStorage.setItem('learningMeaningCache', JSON.stringify(data));
    console.log('AFTER STORING IN CACHE:', localStorage.getItem('learningMeaningCache'));
}