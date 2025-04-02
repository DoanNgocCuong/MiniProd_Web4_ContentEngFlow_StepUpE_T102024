@echo off

:: Create virtual environment
python -m venv .venv

:: Activate virtual environment
call .venv\Scripts\activate.bat

:: Install dependencies
pip install -r requirements.txt

:: Create .env file if it doesn't exist
if not exist .env (
    copy .env.example .env
    echo Created .env file. Please update with your OpenAI API key.
)

echo Setup complete! Activate the virtual environment with: .venv\Scripts\activate.bat 