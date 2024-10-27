// Fetch OpenAI API key from environment or use a stored one
const apiKey = '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';

let storagedLessons;

/**
 * ---------------------------------------------------------------------------------------------------------
 * Event Listeners and Initialization
 * ---------------------------------------------------------------------------------------------------------
 */

function copyCheckedLessons() {
    const table = document.querySelector('.lesson-table');
    if (!table) {
        alert('No lessons to copy!');
        return;
    }

    const rows = table.querySelectorAll('tbody tr');
    let textToCopy = '';

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowText = Array.from(cells)
            .slice(0, -2) // Bỏ qua 2 cột cuối (Edit và Delete)
            .map(cell => cell.textContent)
            .join('\t');
        textToCopy += rowText + '\n';
    });

    navigator.clipboard.writeText(textToCopy)
        .then(() => alert('Selected lessons copied to clipboard!'))
        .catch(err => console.error('Failed to copy: ', err));
}


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

    return `Based on the provided context that provide you the number of questions  need to be generated, the topic, level, generate the content for an English lesson with additional context ${extraRequirements}
            For each question, you must return in the following dictionary format. Generate ${questionCount} questions about the topic "${topic}" for English learners at the ${level} level:
                'question':put question here,
                'structure':put answer structure here,
                'main phrase':put main phrase for filling in the blank of 'structure' here,
                'optional phrase 1':put optional phrase 1 for filling in the blank of 'structure' here,
                'optional phrase 2':put optional phrase 2 for filling in the blank of 'structure' here,
                'question-vi':put question in Vietnamese here,
                'structure-vi':put answer structure in Vietnamese here,
                'main phrase-vi':put main phrase in Vietnamese for filling in the blank of 'structure' here,
                'optional phrase 1-vi':put optional phrase 1 in Vietnamese for filling in the blank of 'structure' here,
                'optional phrase 2-vi':put optional phrase 2 in Vietnamese for filling in the blank of 'structure' here,
            For example:
                {
                    "question":"Which company are you working for?",
                    "structure":"I'm the ______ from ABC Company. ",
                    "main phrase":"Sales representative",
                    "optional phrase 1":"Sales director",
                    "optional phrase 2":"Sales associate"
                    "question-vi":"Bạn đang làm việc cho công ty nào vậy?",
                    "structure-vi":"Tôi là _____ từ công ty ABC.",
                    "main phrase-vi":"Đại diện kinh doanh",
                    "optional phrase 1-vi":"Giám đốc kinh doanh",
                    "optional phrase 2-vi":"Nhân viên bán hàng"
                }`;
}

async function generateQuestions(prompt) {
    try {
        showLoadingDialog();
        const response = await fetch('http://localhost:5000/api/generate-questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
        const lessons = JSON.parse(data.choices[0].message.content.trim().replace(/```json|```/g, ''));
        storagedLessons = lessons;
        if (Array.isArray(lessons)) {
            displayGeneratedQuestions(lessons);
        } else {
            console.error('Expected an array but got:', lessons);
        }
    } catch (jsonError) {
        console.error('Invalid JSON returned by API:', jsonError);
        console.error('Raw content:', data.choices[0].message.content);
    }
}

/**
 * ---------------------------------------------------------------------------------------------------------
 * Question Display and Editing
 * ---------------------------------------------------------------------------------------------------------
 */

function displayGeneratedQuestions(lessons) {
    const container = document.getElementById('question-container');
    container.innerHTML = '';
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
    const range = document.createRange();
    range.selectNode(table);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
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
            generateFlexiblePhrase(storagedLessons); // Call the function for Flexible Phrase
        } else if (tabId === 'qa') {
            generateQA(storagedLessons); // Call the function for Q&A
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

// Function to call OpenAI API
async function genOpenAIResponse(apiKey, systemPrompt, userPrompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            max_tokens: 3000,
            temperature: 0.7
        })
    });
    
    const data = await response.json();
    if (!data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response from API');
    }
    return data;
}

// Sửa lại hàm generateLearningMeaning
async function generateLearningMeaning(storagedLessons) {
    try {
        showLoadingDialog();
        const allResults = [];
        
        // Xử lý từng lesson một
        for (const lesson of storagedLessons) {
            const lessonPrompt = JSON.stringify({
                structure: lesson.structure,
                mainPhrase: lesson["main phrase"],
                optionalPhrase: lesson["optional phrase 1"]
            }, null, 2);
            // example of lessonPrompt:
            // {
            //     "structure": "I'm the ______ from ABC Company.",
            //     "mainPhrase": "Sales representative",
            //     "optionalPhrase": "Sales director"
            // }
            
            const response = await genOpenAIResponse(apiKey, LEARNING_MEANING_PROMPT, lessonPrompt);
            const lessonResults = JSON.parse(response.choices[0].message.content);
            allResults.push(...lessonResults);
        }

        // Truyền trực tiếp mảng kết quả
        displayLearningMeaningResults(allResults);

    } catch (error) {
        alert(error.message);
        console.error('Error:', error.message);
    } finally {
        hideLoadingDialog();
    }
}
// Hàm hiển thị kết quả học nghĩa
function displayLearningMeaningResults(lessons) {
    try {
        // Kiểm tra dữ liệu đầu vào có hợp lệ không
        if (!lessons || !Array.isArray(lessons)) {
            throw new Error('Invalid lessons data received');
        }
        
        // Lấy container từ DOM để hiển thị kết quả
        const container = document.getElementById('learning-meaning-container'); 
        // Xóa nội dung cũ trong container
        container.innerHTML = '';
        // Tạo bảng mới từ dữ liệu lessons
        const table = createLearningMeaningTable(lessons);
        // Thêm bảng vào container
        container.appendChild(table);
    } catch (error) {
        // Ghi log lỗi vào console
        console.error('Error:', error.message);
        // Hiển thị thông báo lỗi cho người dùng
        alert('Error displaying results: ' + error.message);
    }
}
// Hàm tạo bảng hiển thị kết quả học nghĩa
function createLearningMeaningTable(lessons) {
    // Tạo phần tử table mới
    const table = document.createElement('table');
    // Thêm class cho table để áp dụng CSS
    table.className = 'learning-meaning-table';
    // Thêm phần header cho bảng
    table.appendChild(createLearningMeaningTableHeader());
    
    // Tạo phần tbody để chứa nội dung bảng
    const tbody = document.createElement('tbody');
    
    // Duyệt qua mảng lessons, mỗi lần lấy 2 phần tử (main phrase và optional phrase)
    for(let i = 0; i < lessons.length; i += 2) {
        // Tạo hàng cho main phrase
        const mainPhraseRow = document.createElement('tr');
        // Tạo mảng chứa nội dung các ô cho main phrase
        const mainCells = [
            'Hãy dịch cụm in đậm', // Cột mô tả
            lessons[i].sentence, // Câu tiếng Anh
            lessons[i].answer_1, // Đáp án 1
            lessons[i].answer_2, // Đáp án 2
            lessons[i].answer_3, // Đáp án 3
            lessons[i].answer_2_description, // Mô tả đáp án 2
            lessons[i].answer_3_description  // Mô tả đáp án 3
        ];
        
        // Duyệt qua mảng nội dung để tạo các ô
        mainCells.forEach(content => {
            const td = document.createElement('td');
            td.textContent = content || ''; // Gán nội dung cho ô, nếu không có thì để trống
            mainPhraseRow.appendChild(td);
        });
        tbody.appendChild(mainPhraseRow);

        // Tạo hàng cho optional phrase
        const optionalPhraseRow = document.createElement('tr');
        // Tạo mảng chứa nội dung các ô cho optional phrase
        const optionalCells = [
            'Hãy dịch cụm in đậm', // Cột mô tả
            lessons[i+1].sentence, // Câu tiếng Anh
            lessons[i+1].answer_1, // Đáp án 1
            lessons[i+1].answer_2, // Đáp án 2
            lessons[i+1].answer_3, // Đáp án 3
            lessons[i+1].answer_2_description, // Mô tả đáp án 2
            lessons[i+1].answer_3_description  // Mô tả đáp án 3
        ];
        
        // Duyệt qua mảng nội dung để tạo các ô
        optionalCells.forEach(content => {
            const td = document.createElement('td');
            td.textContent = content || ''; // Gán nội dung cho ô, nếu không có thì để trống
            optionalPhraseRow.appendChild(td);
        });
        tbody.appendChild(optionalPhraseRow);
    }
    
    // Thêm phần tbody vào bảng
    table.appendChild(tbody);
    return table;
}

// Hàm tạo header cho bảng learning meaning
function createLearningMeaningTableHeader() {
    // Tạo phần tử thead
    const thead = document.createElement('thead');
    // Thêm nội dung HTML cho thead với các cột tương ứng
    thead.innerHTML = `
        <tr>
            <th>Description</th>
            <th>Sentence (EN)</th>
            <th>Answer 1</th>
            <th>Answer 2</th>
            <th>Answer 3</th>
            <th>Answer 2 Description</th>
            <th>Answer 3 Description</th>
        </tr>
    `;
    return thead;
}


/**
 * ---------------------------------------------------------------------------------------------------------
 * Generate Learning Card
 * ---------------------------------------------------------------------------------------------------------
 */

async function generateLearningCard(storagedLessons) {
    try {
        showLoadingDialog();

        const mappedList = storagedLessons.map(item => ({
            structure: item["structure"],
            main_phrase: item["main phrase"]
        }));
        // Check if custom prompt is provided
        const customPrompt = document.getElementById('custom-prompt-text').value.trim();
        const prompt = customPrompt ||
        `Based on the provided context ${JSON.stringify(mappedList, null, 2)}, generate the exercise content.
        - For each object in the provided list. You must follow the below steps and response as a JSON array of objects.
            + Step 1. Do this first:
                [1] create the IPA for 'structure'.
                [2] create the IPA for 'phrase'.
            + Step 2. Then return in the following dictionary format:
                sentence_en: put the 'structure' here.
                sentence_vi: put the 'structure-vi' here.
                ipa: put [1] here.
                sentence_en: put the 'main_phrase' here.
                sentence_vi: put the 'main_phrase-vi' here.
                ipa: put [2] here.
        - Each object generate 2 sentence: structure and main_phrase. Total number of sentences is doubled of size of provided list
        For example:
        [    
            {
              "description": "Hãy nói cụm sau",
              "sentence_en": "Over ten years",
              "sentence_vi": "Hơn mười năm",
              "ipa": "/\\u02C8\\u0259\\u028Av\\u0259r t\\u025Bn j\\u026Arz/"
            },
            {
              "description": "Hãy nói cụm sau",
              "sentence_en": "I have been learning English for",
              "sentence_vi": "Tôi đã học tiếng Anh được",
              "ipa": "/a\\u026A h\\u00E6v b\\u026An \\u02C8l\\u0253\\u02D0rn\\u026A\\u014B \\u02C8\\u026A\\u014Bgl\\u026A\\u0283 f\\u0254\\u02D0r/"
            },
        ]`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are an expert at English exercise content generating, only respond in json' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 3000,
                temperature: 0.7
            })
        });
        const data = await response.json();
        displayLearningCardResults(data); // Call the function to display results

    } catch (error) {
        alert(error.message);
        console.error('Error:', error.message);
    } finally {
        hideLoadingDialog();
    }
}

function displayLearningCardResults(data) {
    const lessons = JSON.parse(data.choices[0].message.content.trim().replace(/```json|```/g, ''));
    const container = document.getElementById('learning-card-container'); // Ensure you have a container in your HTML
    container.innerHTML = ''; // Clear previous results

    const table = createLearningCardTable(lessons);
    container.appendChild(table);
}

function createLearningCardTable(lessons) {
    const table = document.createElement('table');
    table.className = 'learning-meaning-table';
    table.appendChild(createLearningCardTableHeader());
    table.appendChild(createLearningCardTableBody(lessons));
    return table;
}

function createLearningCardTableHeader() {
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Description</th>
            <th>Sentence (EN)</th>
            <th>Sentence (VI)</th>
            <th>IPA</th>
        </tr>
    `;
    return thead;
}

function createLearningCardTableBody(lessons) {
    const tbody = document.createElement('tbody');
    lessons.forEach(lesson => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${lesson.description}</td>
            <td>${lesson.sentence_en}</td>
            <td>${lesson.sentence_vi}</td>
            <td>${lesson.ipa}</td>
        `;
        tbody.appendChild(row);
    });
    return tbody;
}

function extractPhrases(storagedLessons) {
    return storagedLessons.map(lesson => [
        lesson['main phrase'],
        lesson['optional phrase 1']
    ]).flat();
}

function displayExerciseOutput(text, type) {
    const exercisesOutput = document.getElementById('exercises-output');
    const exerciseContainer = document.createElement('div');
    exerciseContainer.classList.add('exercise-output');

    exerciseContainer.innerHTML = `
        <h4>${type}</h4>
        <p>${text}</p>
    `;
    exercisesOutput.appendChild(exerciseContainer);
}


/**
 * ---------------------------------------------------------------------------------------------------------
 * Utility Functions
 * ---------------------------------------------------------------------------------------------------------
 */

function showLoadingDialog() {
    const loadingDialog = document.getElementById('loading-dialog');
    loadingDialog.style.display = 'flex';
}

function hideLoadingDialog() {
    const loadingDialog = document.getElementById('loading-dialog');
    loadingDialog.style.display = 'none';
}

function handleDownloadDraft() {
    updateStoragedLessonsFromTable();
    const csvContent = convertToCSV(storagedLessons);
    downloadCSV(csvContent, 'lessons.csv');
}

function updateStoragedLessonsFromTable() {
    const table = document.querySelector('.lesson-table');
    if (!table) {
        console.error('Table not found');
        return;
    }

    const rows = table.querySelectorAll('tbody tr');
    storagedLessons = Array.from(rows).map(row => {
        const cells = row.querySelectorAll('td');
        return {
            question: cells[0].textContent,
            'sentence-with-blank': cells[1].textContent,
            'main-chunk': cells[2].textContent,
            chunk1: cells[3].textContent,
            chunk2: cells[4].textContent
        };
    });
}

function copyExerciseContent(exerciseType) {
    let content;
    switch (exerciseType) {
        case 'learning-meaning':
            content = document.getElementById('learning-meaning-container').innerText;
            break;
        case 'learning-card':
            content = document.getElementById('learning-card-container').innerText;
            break;
        case 'flexible-phrase':
            content = document.getElementById('flexible-phrase-container').innerText;
            break;
        case 'qa':
            content = document.getElementById('qa-container').innerText;
            break;
        default:
            console.error('Invalid exercise type');
            return;
    }

    // Copy to clipboard
    navigator.clipboard.writeText(content).then(() => {
        alert(`${exerciseType.replace('-', ' ')} content copied to clipboard!`);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

let storageLessons = []; // Assuming this is defined somewhere in your code

function updateStorageLessons(lessons) {
    const checkboxes = document.querySelectorAll('.lesson-checkbox');
    storageLessons = []; // Reset storageLessons

    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            storageLessons.push(lessons[index]); // Add the lesson to storageLessons if checked
        }
    });

    console.log('Updated storageLessons:', storageLessons); // For debugging
}

/**
 * ---------------------------------------------------------------------------------------------------------
 * Generate Flexible Phrase
 * ---------------------------------------------------------------------------------------------------------
 */

async function generateFlexiblePhrase(storagedLessons) {
    try {
        showLoadingDialog();

        const mappedList = storagedLessons.map(item => ({
            question: item["question"],
            answer_structure: item["answer structure"],
            main_phrase: item["main phrase"],
            optional_phrase_1: item["optional phrase 1"],
            optional_phrase_2: item["optional phrase 2"]
        }));

        // Check if custom prompt is provided
        const customPrompt = document.getElementById('custom-prompt-text').value.trim();
        const prompt = customPrompt ||
        `You are an expert at English exercise content generating. \
         Based on the provided context, generate the exercise content. \
         - For each 'question' in the provided context, follow these steps: \
           + Step 1: \
               [1] Use 'main_phrase' to fill in the blank of 'answer_structure'. \
               [2] Use 'optional_phrase_1' to fill in the blank of 'answer_structure'. \
               [3] Use 'optional_phrase_2' to fill in the blank of 'answer_structure'. \
               [4] Convert [1] to Vietnamese. \
               [5] Convert [2] to Vietnamese. \
               [6] Convert [3] to Vietnamese. \
               [7] Convert 'question' to Vietnamese. \
           + Step 2: Return in dictionary format with duplications as shown below. \
              sentence_en: [1]\\n[1]\\n[2]\\n[3]\\n[1]\\n[2]\\n[3]\\n'question'\\n \
              sentence_vi: [4]\\n[4]\\n[5]\\n[6]\\n[4]\\n[5]\\n[6]\\n[7]\\n \
        `;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are an expert at English exercise content generating, only respond in json' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 3000,
                temperature: 0.7
            })
        });
        const data = await response.json();

        displayFlexiblePhraseResults(data); // Call function to display results

    } catch (error) {
        alert(error.message);
        console.error('Error:', error.message);
    } finally {
        hideLoadingDialog();
    }
}

function displayFlexiblePhraseResults(data) {
    const phrases = JSON.parse(data.choices[0].message.content.trim().replace(/```json|```/g, ''));
    const container = document.getElementById('flexible-phrase-container'); // Ensure you have a container in your HTML
    container.innerHTML = ''; // Clear previous results

    const table = createFlexiblePhraseTable(phrases);
    container.appendChild(table);
}

function createFlexiblePhraseTable(phrases) {
    const table = document.createElement('table');
    table.className = 'flexible-phrase-table';
    table.appendChild(createFlexiblePhraseTableHeader());
    table.appendChild(createFlexiblePhraseTableBody(phrases));
    return table;
}

function createFlexiblePhraseTableHeader() {
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Sentence (EN)</th>
            <th>Sentence (VI)</th>
        </tr>
    `;
    return thead;
}

function createFlexiblePhraseTableBody(phrases) {
    const tbody = document.createElement('tbody');
    phrases.forEach(phrase => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(phrase.sentence_en)}</td>
            <td>${escapeHtml(phrase.sentence_vi)}</td>
        `;
        tbody.appendChild(row);
    });
    return tbody;
}







