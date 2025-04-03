#!/bin/bash
echo "Setting up Content Generation Flow..."

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Run the content generation flow
echo "Running Content Generation Flow..."
python content_generation_flow.py

# Deactivate virtual environment
echo "Deactivating virtual environment..."
deactivate

echo "Setup and run completed!" 