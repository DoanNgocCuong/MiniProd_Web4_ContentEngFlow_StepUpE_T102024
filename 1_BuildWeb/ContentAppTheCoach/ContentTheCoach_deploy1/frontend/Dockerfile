FROM node:18-alpine

WORKDIR /app

# Install a simple HTTP server
RUN npm install -g http-server

# Copy frontend files
COPY . .

EXPOSE 80

# Update the command to serve from the src directory
CMD ["http-server", "src", "-p", "80", "--cors", "-a", "0.0.0.0"]
