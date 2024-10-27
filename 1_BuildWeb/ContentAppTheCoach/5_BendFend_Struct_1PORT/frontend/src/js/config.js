export const config = {
    development: {
      apiUrl: 'http://localhost:3000/api'
    },
    production: {
      apiUrl: 'http://backend:3000/api'  // Docker service name
    }
};

const environment = process.env.NODE_ENV || 'development';
export default config[environment];
