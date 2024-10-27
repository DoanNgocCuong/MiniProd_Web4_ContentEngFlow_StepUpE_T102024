FROM node:18-alpine # Base image để chạy Node.js

WORKDIR /app # Tạo và set thư mục làm việc

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Copy .env file
COPY .env .env

EXPOSE 3000 # Document port

CMD ["npm", "start"] # Command để chạy app
