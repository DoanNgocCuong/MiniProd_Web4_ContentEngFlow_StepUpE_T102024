# How to Deploy the Application Using Docker

## Prerequisites
- Docker installed on your system
- Git (optional, for version control)

## Step-by-Step Deployment Instructions

### 1. Build the Docker Image
```bash
# Navigate to the frontend directory
cd 1_srcContentGeneration/src/streamlit_frontend

# Build the Docker image
docker build -t learning-path-app .
```

### 2. Run the Docker Container
```bash
# Run the container
docker run -d -p 8501:8501 --name learning-path-app learning-path-app
```

### 3. Access the Application
- Open your web browser and go to `http://localhost:8501`
- If deploying on a server, replace `localhost` with your server's IP address or domain

## Docker Commands Reference

### Basic Commands
```bash
# Stop the container
docker stop learning-path-app

# Start the container
docker start learning-path-app

# Remove the container
docker rm learning-path-app

# View container logs
docker logs learning-path-app
```

### Advanced Commands
```bash
# Run with custom port
docker run -d -p 8502:8501 --name learning-path-app learning-path-app

# Run with environment variables
docker run -d -p 8501:8501 -e API_URL=http://your-api-url:3000 --name learning-path-app learning-path-app

# Run with volume mounting (for development)
docker run -d -p 8501:8501 -v $(pwd):/app --name learning-path-app learning-path-app
```

## Docker Compose Deployment

### 1. Create docker-compose.yml
```yaml
version: '3'
services:
  learning-path-app:
    build: .
    ports:
      - "8501:8501"
    environment:
      - API_URL=http://your-api-url:3000
    restart: unless-stopped
```

### 2. Run with Docker Compose
```bash
# Start the services
docker-compose up -d

# Stop the services
docker-compose down

# View logs
docker-compose logs -f
```

## Production Deployment Considerations

### 1. Security
- Use HTTPS in production
- Set up proper firewall rules
- Use environment variables for sensitive data
- Consider using Docker secrets for sensitive information

### 2. Performance
- Use Docker volumes for persistent data
- Configure proper resource limits
- Set up monitoring and logging

### 3. Maintenance
- Regular container updates
- Backup strategies
- Monitoring and alerting

## Troubleshooting

### Common Issues

1. **Container won't start**
   - Check logs: `docker logs learning-path-app`
   - Verify port availability
   - Check resource constraints

2. **Application not accessible**
   - Verify port mapping
   - Check firewall settings
   - Ensure container is running

3. **API Connection Issues**
   - Verify API URL configuration
   - Check network connectivity
   - Verify API endpoint accessibility

## Best Practices

1. **Version Control**
   - Tag Docker images with versions
   - Use specific version tags instead of 'latest'

2. **Resource Management**
   - Set memory and CPU limits
   - Monitor resource usage
   - Implement auto-scaling if needed

3. **Security**
   - Regular security updates
   - Use non-root user in container
   - Implement proper access controls

4. **Monitoring**
   - Set up container monitoring
   - Implement logging
   - Configure alerts for issues
