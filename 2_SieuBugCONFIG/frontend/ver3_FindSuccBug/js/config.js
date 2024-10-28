const config = {
    development: {
        apiUrl: 'http://localhost:3000/api'
    },
    dockerinternal: {
        apiUrl: 'http://backend:3000/api'
    },
    production: {
        apiUrl: 'http://103.253.20.13:3000/api'
    }
};

// Lấy giá trị môi trường từ biến môi trường NODE_ENV
// Nếu không có giá trị, mặc định sử dụng 'development'
const environment = process.env.NODE_ENV || 'development';

// Xuất cấu hình tương ứng với môi trường hiện tại
// Ví dụ: Nếu NODE_ENV='production' thì sẽ xuất config.production
export default config[environment];
