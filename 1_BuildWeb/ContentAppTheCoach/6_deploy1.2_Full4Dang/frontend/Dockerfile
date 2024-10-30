# Base image để chạy Node.js
FROM node:18-alpine                   

# Tạo và set thư mục làm việc
WORKDIR /app                          # Tạo và set thư mục làm việc

# Install a simple HTTP server
RUN npm install -g http-server

# Copy frontend files
COPY . .

# Port giao tiếp từ máy khách về server
EXPOSE 25007

# Update the command to serve from the src directory
CMD ["http-server", "src", "-p", "25007", "--cors", "-a", "0.0.0.0", "-c-1"]
