// Xác định môi trường dựa trên URL hoặc biến môi trường
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const env = isDevelopment ? 'development' : 'production';

// Xuất một object config chứa các cấu hình API URL cho từng môi trường
export const config = {
    // Môi trường development (phát triển): 
    // Sử dụng localhost vì frontend và backend chạy trên cùng máy tính
    development: {
      apiUrl: 'http://localhost:3000/api'
    },

    // Môi trường docker internal:
    // Sử dụng tên service 'backend' được định nghĩa trong docker-compose
    // để giao tiếp giữa các container trong mạng nội bộ Docker
    dockerInternal: {
      apiUrl: 'http://backend:3000/api'  // Docker service name
    },

    // Môi trường production (triển khai):
    // Sử dụng IP public của server để frontend có thể gọi API
    // từ bất kỳ đâu trên internet
    production: {
      apiUrl: 'http://103.253.20.13:3000/api' // IP public
    }
};

// Export the current environment's config
export const currentConfig = config[env];

export default config;