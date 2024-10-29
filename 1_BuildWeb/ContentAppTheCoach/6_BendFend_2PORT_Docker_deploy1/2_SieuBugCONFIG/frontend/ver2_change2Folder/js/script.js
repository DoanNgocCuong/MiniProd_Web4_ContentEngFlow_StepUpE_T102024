// Import từ config.js trong cùng thư mục js
import config from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const apiUrlElement = document.getElementById('apiUrl');
    const envButtons = document.querySelectorAll('button');
    
    function updateApiUrl(environment) {
        console.log('Selected environment:', environment);
        console.log('Config:', config);
        const apiUrl = config[environment].apiUrl;
        apiUrlElement.textContent = `API URL hiện tại: ${apiUrl}`;
    }

    envButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const environment = e.target.textContent.toLowerCase().replace(' ', '');
            console.log('Button clicked:', environment);
            updateApiUrl(environment);
        });
    });

    updateApiUrl('development');
});