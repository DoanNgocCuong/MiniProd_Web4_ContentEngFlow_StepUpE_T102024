// config.js
const config = {
  development: {
      apiUrl: 'http://localhost:3000/api'
  },
  dockerInternal: {
      apiUrl: 'http://backend:3000/api'
  },
  production: {
      apiUrl: 'http://103.253.20.13:3000/api'
  }
};

export default config;

