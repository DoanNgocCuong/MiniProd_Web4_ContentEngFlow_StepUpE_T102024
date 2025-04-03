@echo off
echo Setting up Content Generation Flow...

:: Create virtual environment if it doesn't exist
if not exist .venv (
    echo Creating virtual environment...
    python -m venv .venv
)

:: Activate virtual environment
echo Activating virtual environment...
call .venv\Scripts\activate

:: Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

:: Run the content generation flow
echo Running Content Generation Flow...
python content_generation_flow.py

:: Deactivate virtual environment
echo Deactivating virtual environment...
deactivate

echo Setup and run completed!
pause 