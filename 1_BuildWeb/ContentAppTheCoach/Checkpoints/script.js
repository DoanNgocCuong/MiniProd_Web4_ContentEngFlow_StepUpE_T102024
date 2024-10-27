// Fetch OpenAI API key from environment or use a stored one
const apiKey = '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';

let storagedLessons;

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
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are an expert at English lesson topic-related content generating, only respone in json' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 3000,
                temperature: 0.7
            })
        });
        const data = await response.json();
        processApiResponse(data);
    } catch (error) {
        alert(error.message)
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

async function generateLearningMeaning(storagedLessons) {
    try {
        showLoadingDialog();
        
        // Extract phrases from the stored lessons - Duyệt qua từng dòng data và lấy ra các cụm từ
        const mappedList = storagedLessons.map(item => ({
            structure: item["structure"],
            main_phrase: item["main phrase"],
            optional_phrase: item["optional phrase 1"]
        }));

        // Check if custom prompt is provided
        const customPrompt = document.getElementById('custom-prompt-text').value.trim();
        //customPrompt || 
        const prompt = 
        `Based on the provided list ${JSON.stringify(mappedList, null, 2)}, generate the exercise content.
        - For each object from list. You must follow the below steps:
            + Step 1. Do this first: 
                [0] Get structure and main phrase from mappedList
                [1] converting the 'structure' to Vietnamese.
                [2] extracting the 'main phrase' in the provided context, and keep it in English.
                [3] converting the extracted 'main phrase' to Vietnamese.
                [4] must create the format like this: <g>put [1] here</g>put [3] here.
            + Step 2. Then return in the following dictionary format.
                description: always is "Hãy dịch cụm in đậm"
                sentence: put [4] here.
                answer_1: put [2] here.
                answer_2: create another English phrase in the same domain, word form with 'main_phrase' at [2], and put only this phrase here.
                answer_2_description: explain why the answer_2 above is wrong grammar, note that highlight the wrong phrase by putting it in <r></r>.
                answer_3: create another English phrase in the same domain, word form with 'main_phrase' at [2], and put only this phrase here.
                answer_3_description: explain why the answer_3 above is wrong grammar, note that highlight the wrong phrase by putting it in <r></r>.
            + Repeat step 1 and step 2 with optional phrase
            For example:
                {
                    "description": "Hãy dịch cụm in đậm",
                    "sentence": "We plan to give them <g>những cuốn sổ tay</g>.",
                    "answer_1": "notebooks",
                    "answer_2": "sketchbooks",
                    "answer_3": "workbooks",
                    "answer_2_description": "<r>sketchbooks</r> mang nghĩa là \"sổ phác thảo\" nên sai nghĩa so với yêu cầu của đề bài.",
                    "answer_3_description": "<r>workbooks</r> mang nghĩa là \"sách bài tập\" nên sai nghĩa so với yêu cầu của đề bài."
                }
        - The total number of dictionaries depends on the total number of 'structure' in the provided context.
        - Give me format of 4 charactor to keep them when show in table: <g>, </g>, <r>, </r>
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

        displayLearningMeaningResults(data); // Call the function to display results

    } catch (error) {
        alert(error.message);
        console.error('Error:', error.message);
    } finally {
        hideLoadingDialog();
    }
}

//
function displayLearningMeaningResults(data) {
    const lessons = JSON.parse(data.choices[0].message.content.trim().replace(/```json|```/g, ''));
    const container = document.getElementById('learning-meaning-container'); // Ensure you have a container in your HTML
    container.innerHTML = ''; // Clear previous results

    const table = createLearningMeaningTable(lessons);
    container.appendChild(table);
}

function createLearningMeaningTable(lessons) {
    const table = document.createElement('table');
    table.className = 'learning-meaning-table';
    table.appendChild(createLearningMeaningTableHeader());
    table.appendChild(createLearningMeaningTableBody(lessons));
    return table;
}

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
        </tr>
    `;
    return thead;
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function createLearningMeaningTableBody(lessons) {
    const tbody = document.createElement('tbody');
    lessons.forEach(lesson => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(lesson.description)}</td>
            <td>${escapeHtml(lesson.sentence)}</td>
            <td>${escapeHtml(lesson.answer_1)}</td>
            <td>${escapeHtml(lesson.answer_2)}</td>
            <td>${escapeHtml(lesson.answer_3)}</td>
            <td>${escapeHtml(lesson.answer_2_description)}</td>
            <td>${escapeHtml(lesson.answer_3_description)}</td>
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





