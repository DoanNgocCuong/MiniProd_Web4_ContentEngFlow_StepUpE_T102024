FROM node:18-alpine                    # Base image để chạy Node.js

WORKDIR /app                          # Tạo và set thư mục làm việc

# Install a simple HTTP server
RUN npm install -g http-server

# Copy frontend files
COPY . .

EXPOSE 80                             # Document port (như đã giải thích)

# Update the command to serve from the src directory
CMD ["http-server", "src", "-p", "80", "--cors", "-a", "0.0.0.0"]

