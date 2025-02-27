export function showLoadingDialog() {
    const loadingDialog = document.getElementById('loading-dialog');
    if (!loadingDialog) {
        console.error('Loading dialog not found');
        return;
    }
    loadingDialog.style.display = 'flex';
}

export function hideLoadingDialog() {
    const loadingDialog = document.getElementById('loading-dialog');
    if (!loadingDialog) {
        console.error('Loading dialog not found');
        return;
    }
    loadingDialog.style.display = 'none';
}

// utils.js
export const generateLessonId = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `LESSON_${timestamp}_${random}`;
};