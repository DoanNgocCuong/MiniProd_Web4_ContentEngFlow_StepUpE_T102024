import json
import requests
from typing import Dict, List
from pathlib import Path
from datetime import datetime
import pandas as pd
import sys
from pathlib import Path

# Add parent directory to Python path
sys.path.append(str(Path(__file__).parent.parent))
from models.user_profile import UserProfile

class DetailChunkingGenerator:
    def __init__(self, base_url: str = "http://103.253.20.13:3000"):
        self.base_url = base_url
        self.output_dir = Path("output")
        self.output_dir.mkdir(exist_ok=True)

    def generate_detail_chunking(self, user_profile: Dict, week_data: Dict, question_data: Dict) -> Dict:
        """
        Generate detail chunking from questions using the new generate-learning-onion API
        """
        # Format the input according to API requirements
        questions_text = "\n".join([f"{i+1}. {q}" for i, q in enumerate(question_data["questions"])])
        
        formatted_input = {
            "inputForOnion": f"USER PROFILE:\n"
                           f"- Industry: [{user_profile.industry}]\n"
                           f"- Job: [{user_profile.job}]\n"
                           f"- Gender: {user_profile.gender}\n"
                           f"- Native language: {user_profile.native_language}\n"
                           f"- English Level: [{user_profile.english_level}]\n"
                           f"- Learning goals: {' '.join([f'[{goal}]' for goal in user_profile.learning_goals])}\n\n"
                           f"TOPIC: {question_data['topic']}\n"
                           f"SCENARIO: {question_data['scenario']}\n"
                           f"QUESTIONS:\n{questions_text}"
        }

        # Call API
        response = requests.post(
            f"{self.base_url}/api/generate-learning-onion",
            json=formatted_input
        )
        response.raise_for_status()
        
        # Parse response
        result = response.json()
        
        # Create data for Excel
        data = [
            {
                "Week": week_data["week"],
                "Scenario": question_data["scenario"],
                "Question": question,
                "Title": result["lesson_details"].split("2. **Context**: ")[0].replace("1. **Title**: ", "").strip(),
                "Context": result["lesson_details"].split("2. **Context**: ")[1].split("3. **Character**: ")[0].strip(),
                "Character": result["lesson_details"].split("3. **Character**: ")[1].split("4. **Tasks**: ")[0].strip(),
                "Tasks": result["lesson_details"].split("4. **Tasks**: ")[1].strip(),
                "System Prompt": result["system_prompt"],
                "First Message": result["first_message"]
            }
            for question in question_data["questions"]
        ]

        # Create DataFrame
        df = pd.DataFrame(data)

        # Save to Excel
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        excel_file = self.output_dir / f"B2_detail_week_{week_data['week']}_{timestamp}.xlsx"
        df.to_excel(excel_file, index=False)

        return {
            "excel_file": str(excel_file),
            "data": data
        }

def main():
    # Example usage
    # Create user profile
    user_profile = UserProfile(
        industry="IT",
        job="Back end developer",
        gender="Male",
        native_language="Vietnamese",
        english_level="A2",
        learning_goals=["workplace communication", "daily standup", "project updates"]
    )

    # Create test week data
    test_week = {
        "week": 1,
        "topic": "Daily standup",
        "scenarios": [
            {"scenario": "Chia sẻ tiến độ công việc"}
        ]
    }

    # Create test question data
    test_question = {
        "topic": "Daily standup",
        "scenario": "Chia sẻ tiến độ công việc",
        "questions": [
            "Can you describe what you accomplished since our last meeting?",
            "What tasks are you currently working on?",
            "How do you feel about your progress on your projects?",
            "Is there anything that has changed in your work since yesterday?"
        ]
    }

    # Generate detail chunking
    generator = DetailChunkingGenerator()
    result = generator.generate_detail_chunking(user_profile, test_week, test_question)
    print(f"Detail chunking generated and saved to Excel: {result['excel_file']}")

if __name__ == "__main__":
    main()
