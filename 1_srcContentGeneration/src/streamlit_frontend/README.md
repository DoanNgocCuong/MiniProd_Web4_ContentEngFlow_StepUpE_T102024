# English Learning Platform

A Streamlit-based web application for generating personalized English learning paths based on user profiles.

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Git (optional, for version control)

## Setup Instructions

### 1. Create and Activate Virtual Environment

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
# Install required packages
pip install -r requirements.txt
```

### 3. Project Structure

```
1_srcContentGeneration/
├── src/
│   └── streamlit_frontend/
│       ├── app.py                    # Main application entry point
│       └── 1_FromUserProfileGenLearningPath.py  # Learning path generator module
├── .venv/                           # Virtual environment directory
├── requirements.txt                 # Project dependencies
└── README.md                        # This file
```

## Running the Application

1. Make sure your virtual environment is activated
2. Run the Streamlit app:

```bash
# Navigate to the src directory
cd src

# Run the application
streamlit run streamlit_frontend/app.py
```

The application will open in your default web browser at `http://localhost:8501`

## Features

- User profile-based learning path generation
- Interactive navigation
- Downloadable learning paths
- Responsive design
- Error handling and user feedback

## Troubleshooting

If you encounter any issues:

1. Make sure your virtual environment is activated
2. Verify all dependencies are installed correctly
3. Check if the API endpoint is accessible
4. Look for error messages in the terminal

## Development

To add new features or modify existing ones:

1. Create a new branch for your changes
2. Make your modifications
3. Test thoroughly
4. Submit a pull request

## License

This project is proprietary and confidential. 