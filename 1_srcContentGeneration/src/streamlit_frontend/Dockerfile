# Use Python 3.9 slim image
FROM python:3.9-slim

# Add metadata labels
LABEL maintainer="Content Engineering Flow Team"
LABEL description="Learning Path App - The Coach Streamlit Frontend"
LABEL version="1.0"
LABEL name="learning-path-app-the-coach-streamlit"

# Set working directory
WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the port Streamlit runs on
EXPOSE 25052

# Set environment variables
ENV PYTHONPATH=/app

# Run the application
CMD ["streamlit", "run", "app.py", "--server.port=25052", "--server.address=0.0.0.0"] 