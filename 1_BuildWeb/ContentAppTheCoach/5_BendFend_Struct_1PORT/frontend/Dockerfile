FROM node:18-alpine

WORKDIR /app

# Install a simple HTTP server
RUN npm install -g http-server

# Copy frontend files
COPY . .

EXPOSE 80

CMD ["http-server", ".", "-p", "80"]