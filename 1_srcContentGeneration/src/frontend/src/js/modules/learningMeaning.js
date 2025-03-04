import { config } from '../config.js';
import { showLoadingDialog, hideLoadingDialog, updateLoadingProgress } from '../utils.js';
import TableLearningMeaningTracking from '../trackings/tableLearningMeaningTracking.js';
import { storagedLessons, generateUniqueId } from '../generateQuestion.js';

const API_URL = config.production.apiUrl;
let learningMeaningLessons = [];
let rawApiResponse;
let currentLessonId = null;

async function generateLearningMeaning(lessons) {
    try {
        const updatedLessons = storagedLessons.map(lesson => ({
            ...lesson,
            "structure-vi": lesson["structure-vi"],
            "main phrase-vi": lesson["main phrase-vi"],
            "optional phrase 1-vi": lesson["optional phrase 1-vi"],
            "optional phrase 2-vi": lesson["optional phrase 2-vi"]
        }));

        currentLessonId = storagedLessons?.[0]?.lesson_id || generateUniqueId();

        showLoadingDialog();
        
        // Giả lập các bước xử lý
        updateLoadingProgress(10); // Bắt đầu gửi request
        
        const response = await fetch(`${API_URL}/generate-learning-meaning`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lessons: updatedLessons })
        });
        
        updateLoadingProgress(50); // Đã nhận response
        
        const data = await response.json();
        updateLoadingProgress(75); // Đã parse JSON
        
        rawApiResponse = data;
        learningMeaningLessons = data.map(item => ({
            ...item,
            lesson_id: currentLessonId
        }));
        
        updateLoadingProgress(90); // Gần xong
        
        displayLearningMeaningResults(learningMeaningLessons);
        updateLoadingProgress(100); // Hoàn thành
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
        if (!currentLessonId) {
            throw new Error('No lesson ID found. Please generate questions first.');
        }

        // Copy table logic
        const tempTable = document.createElement('table');
        tempTable.innerHTML = table.innerHTML;
        document.body.appendChild(tempTable);
        
        // Select and copy
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

        // Prepare tracking data once
        const trackingData = {
            lesson_id: currentLessonId,
            lessons: storagedLessons || [],
            raw: rawApiResponse,
            final: learningMeaningLessons
        };

        // Single console.log with grouped data
        console.group('Learning Meaning Tracking');
        console.log('Tracking Data:', trackingData);
        console.log('Status: Ready to submit to Larkbase');
        console.groupEnd();
    
        // Track after successful copy
        await TableLearningMeaningTracking.trackMeaningGeneration(
            {
                lesson_id: currentLessonId,
                lessons: storagedLessons || []
            },
            rawApiResponse,
            learningMeaningLessons
        );

        console.log('Data submitted to Larkbase:', trackingData);

    } catch (error) {
        console.error('Error copying table:', error);
        alert('Failed to copy table: ' + error.message);
    }
}
  
  // Hàm tạo bảng hiển thị kết quả học nghĩa
function createLearningMeaningTable(lessons) {
    const table = document.createElement('table');
    table.className = 'learning-meaning-table';
    table.appendChild(createLearningMeaningTableHeader());
    
    const tbody = document.createElement('tbody');
    
    // Hiển thị tất cả các dòng kết quả thay vì theo cặp
    for(let i = 0; i < lessons.length; i++) {
        const row = document.createElement('tr');
        const cells = [
            'Hãy dịch cụm in đậm',
            lessons[i].sentence,          // Giữ nguyên các thẻ <g>, <r>
            lessons[i].answer_1,
            lessons[i].answer_2,
            lessons[i].answer_3,
            lessons[i].answer_2_description,  // Giữ nguyên các thẻ <r>
            lessons[i].answer_3_description   // Giữ nguyên các thẻ <r>
        ];
        
        cells.forEach(content => {
            const td = document.createElement('td');
            td.innerHTML = content || ''; // Dùng innerHTML để hiển thị đúng các thẻ <g>, <r>
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