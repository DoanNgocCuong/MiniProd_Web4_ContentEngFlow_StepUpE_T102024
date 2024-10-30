// script.js
import config from './config.js';  // Import config từ file config.js

document.addEventListener('DOMContentLoaded', () => {
    const apiUrlElement = document.getElementById('apiUrl');
    const envButtons = document.querySelectorAll('button');  // Chọn tất cả các button
    
    function updateApiUrl(environment) {
        console.log('Selected environment:', environment);  // Debug log
        console.log('Config:', config);  // Debug log
        const apiUrl = config[environment].apiUrl;
        apiUrlElement.textContent = `API URL hiện tại: ${apiUrl}`;
    }

    // Thêm event listener cho các button
    envButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const environment = e.target.textContent.toLowerCase().replace(' ', '');
            console.log('Button clicked:', environment);  // Debug log
            updateApiUrl(environment);
        });
    });

    // Khởi tạo với development
    updateApiUrl('development');
});