# Base image để chạy Node.js
FROM node:18-alpine 

# Tạo và set thư mục làm việc
WORKDIR /app 

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Copy .env file
COPY .env .env

EXPOSE 3000

CMD ["npm", "start"]