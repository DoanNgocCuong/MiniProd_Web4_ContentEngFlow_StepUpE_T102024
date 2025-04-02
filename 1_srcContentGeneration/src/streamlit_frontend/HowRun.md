# How to Run the Application

## Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

## Step-by-Step Instructions

### 1. Set Up Virtual Environment
```bash
# Navigate to the project directory
cd 1_srcContentGeneration

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# For Windows:
.venv\Scripts\activate
# For Linux/Mac:
source .venv/bin/activate
```

### 2. Install Dependencies
```bash
# Navigate to the frontend directory
cd src/streamlit_frontend

# Install required packages
pip install -r requirements.txt
```

### 3. Run the Application
```bash
# Make sure you're in the streamlit_frontend directory
# Run the application
streamlit run app.py
```

The application will open in your default web browser at `http://localhost:8501`

## Troubleshooting

### Common Issues and Solutions

1. **ModuleNotFoundError: No module named 'streamlit'**
   - Solution: Make sure you've activated the virtual environment and installed requirements
   ```bash
   .venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   ```

2. **ImportError: cannot import name 'main' from '1_FromUserProfileGenLearningPath'**
   - Solution: Check if the file name is correct and the main function is properly defined

3. **API Connection Error**
   - Solution: Verify that the API endpoint (http://103.253.20.13:3000) is accessible
   - Check your internet connection

4. **Port Already in Use**
   - Solution: Either close the application using the port or specify a different port:
   ```bash
   streamlit run app.py --port 8502
   ```

## Development Notes

- The application structure:
  ```
  streamlit_frontend/
  ├── app.py                    # Main application entry point
  ├── 1_FromUserProfileGenLearningPath.py  # Learning path generator module
  ├── requirements.txt          # Project dependencies
  └── HowRun.md                # This file
  ```

- To modify the application:
  1. Make changes to the respective Python files
  2. The application will automatically reload when you save changes
  3. If it doesn't reload, click the "Rerun" button in the Streamlit interface

## Additional Information

- The application uses a wide layout for better visibility
- Navigation is available through the sidebar
- All generated learning paths can be downloaded as JSON files
- The application includes error handling for API calls and data processing
