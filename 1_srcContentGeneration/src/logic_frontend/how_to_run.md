# How to Run the Content Generation Flow

## 1. Setup Virtual Environment

### Windows
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Linux/MacOS
```bash
# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## 2. Run the Content Generation Flow

### Option 1: Run with Default User Profile
```bash
# Make sure you're in the src/logic_frontend directory
cd src/logic_frontend

# Run the script
python content_generation_flow.py
```

### Option 2: Run with Custom User Profile
Create a new Python file (e.g., `run_custom.py`) with the following content:

```python
from content_generation_flow import ContentGenerationFlow
from input import UserProfile

# Create custom user profile
user_profile = UserProfile(
    industry="IT",
    job="CTO",
    gender="Male",
    native_language="Vietnamese",
    english_level="A2",
    learning_goals=["workplace communication", "job interviews", "salary review"]
)

# Initialize and run the flow
flow = ContentGenerationFlow()
flow.process_user_profile(user_profile)
```

Then run:
```bash
python run_custom.py
```

## 3. Output Files

After running the script:
1. All generated Excel files will be saved in the `output` directory
2. Each step generates its own Excel file with timestamp
3. A summary file (`summary.xlsx`) will be created combining all sheets

## 4. Deactivate Virtual Environment

When you're done:
```bash
# Windows
deactivate

# Linux/MacOS
deactivate
```

## Troubleshooting

1. If you get a "ModuleNotFoundError":
   - Make sure you've activated the virtual environment
   - Check if all dependencies are installed correctly

2. If you get API connection errors:
   - Check if the API server is running
   - Verify the base URL in `content_generation_flow.py`

3. If you get Excel file errors:
   - Make sure you have write permissions in the output directory
   - Check if the output directory exists 