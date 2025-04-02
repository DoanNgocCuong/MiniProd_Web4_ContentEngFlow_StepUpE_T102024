// Biến để theo dõi tiến độ
let progressInterval;

export function showLoadingDialog() {
    const loadingDialog = document.getElementById('loading-dialog');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (!loadingDialog || !progressBar || !progressText) {
        console.error('Loading dialog elements not found');
        return;
    }
    
    // Reset tiến độ
    progressBar.style.width = '0%';
    progressText.textContent = '0%';
    
    // Hiển thị dialog
    loadingDialog.style.display = 'flex';
    
    // Thêm class animated cho thanh tiến độ
    progressBar.classList.add('animated');
    
    // Mô phỏng tiến độ
    let progress = 0;
    clearInterval(progressInterval); // Xóa interval cũ nếu có
    
    progressInterval = setInterval(() => {
        // Tăng chậm dần khi tiến gần đến 100%
        if (progress < 90) {
            progress += 5;
        } else if (progress < 95) {
            progress += 0.5;
        } else if (progress < 98) {
            progress += 0.1;
        }
        
        if (progress > 99) {
            progress = 99; // Dừng ở 99% để đợi hideLoadingDialog
            clearInterval(progressInterval);
        }
        
        // Cập nhật UI
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${Math.floor(progress)}%`;
    }, 300); // Cập nhật mỗi 300ms
}

export function hideLoadingDialog() {
    const loadingDialog = document.getElementById('loading-dialog');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (!loadingDialog || !progressBar || !progressText) {
        console.error('Loading dialog elements not found');
        return;
    }
    
    // Dừng timer mô phỏng tiến độ
    clearInterval(progressInterval);
    
    // Hoàn thành tiến độ trước khi đóng
    progressBar.style.width = '100%';
    progressText.textContent = '100%';
    
    // Đợi một chút để người dùng thấy 100% trước khi đóng
    setTimeout(() => {
        loadingDialog.style.display = 'none';
        progressBar.classList.remove('animated');
    }, 500);
}

// Thêm hàm để cập nhật tiến độ trực tiếp (có thể dùng khi biết tiến độ thực tế)
export function updateLoadingProgress(percent) {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (!progressBar || !progressText) {
        return;
    }
    
    // Giới hạn phần trăm từ 0-100
    const progress = Math.max(0, Math.min(100, percent));
    
    // Cập nhật UI
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${Math.floor(progress)}%`;
}

// utils.js
export const generateLessonId = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `LESSON_${timestamp}_${random}`;
};