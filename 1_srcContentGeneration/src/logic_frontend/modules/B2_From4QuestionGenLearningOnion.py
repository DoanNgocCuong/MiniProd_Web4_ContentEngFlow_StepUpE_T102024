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
        Generate detail chunking from a question using the new generate-learning-onion API
        """
        # Format the input according to API requirements
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
                           f"QUESTIONS:\n1. {question_data['question']}"
        }

        # Call API
        response = requests.post(
            f"{self.base_url}/api/generate-learning-onion",
            json=formatted_input
        )
        response.raise_for_status()
        
        # Parse response
        result = response.json()
        
        # Parse the JSON string from chunkingPhrases
        parsed_result = json.loads(result["chunkingPhrases"])
        
        # Transform response to match expected format
        detail = {
            "question": question_data["question"],
            "structure": parsed_result["system_prompt"],
            "main phrase": parsed_result["first_message"],
            "optional phrase 1": parsed_result["lesson_details"].split("4. **Tasks**: ")[1].split(", ")[0],
            "optional phrase 2": parsed_result["lesson_details"].split("4. **Tasks**: ")[1].split(", ")[1],
            "question-vi": parsed_result["lesson_details"].split("1. **Title**: ")[1].split("2. **Context**: ")[0].strip(),
            "structure-vi": parsed_result["lesson_details"].split("2. **Context**: ")[1].split("3. **Character**: ")[0].strip(),
            "main phrase-vi": parsed_result["lesson_details"].split("3. **Character**: ")[1].split("4. **Tasks**: ")[0].strip(),
            "optional phrase 1-vi": parsed_result["lesson_details"].split("4. **Tasks**: ")[1].split(", ")[2],
            "optional phrase 2-vi": parsed_result["lesson_details"].split("4. **Tasks**: ")[1].split(", ")[3]
        }

        # Save to Excel
        self._save_to_excel(week_data["week"], question_data["scenario"], question_data["question"], detail)

        return detail

    def _save_to_excel(self, week: int, scenario: str, question: str, detail: Dict) -> str:
        """
        Save detail chunking to Excel file
        """
        # Prepare data for Excel
        data = []
        for key, value in detail.items():
            if isinstance(value, list):
                for item in value:
                    data.append({
                        "Week": week,
                        "Scenario": scenario,
                        "Question": question,
                        "Key": key,
                        "Value": item
                    })
            else:
                data.append({
                    "Week": week,
                    "Scenario": scenario,
                    "Question": question,
                    "Key": key,
                    "Value": value
                })

        # Create DataFrame
        df = pd.DataFrame(data)

        # Save to Excel
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        excel_file = self.output_dir / f"B2_detail_week_{week}_{timestamp}.xlsx"
        df.to_excel(excel_file, index=False)

        return str(excel_file)

def main():
    # Example usage
    # Create user profile
    user_profile = UserProfile(
        industry="AI",
        job="CTO",
        gender="Male",
        native_language="Vietnamese",
        english_level="B1",
        learning_goals=["workplace communication", "job interviews", "salary review"]
    )

    # Create test week data
    test_week = {
        "week": 1,
        "topic": "Project updates (Cập nhật dự án)",
        "scenarios": [
            {"scenario": "Giới thiệu dự án mới"},
            {"scenario": "Thảo luận tiến độ hiện tại"},
            {"scenario": "Giải quyết vấn đề phát sinh"},
            {"scenario": "Đề xuất cải tiến dự án"},
            {"scenario": "Lên kế hoạch cho tuần tới"}
        ]
    }

    # Create test question data
    test_question = {
        "topic": "Giới thiệu dự án hiện tại",
        "scenario": "Giới thiệu dự án hiện tại",
        "question": "Can you describe the main goals of the current project?"
    }

    # Generate detail chunking
    generator = DetailChunkingGenerator()
    detail = generator.generate_detail_chunking(user_profile, test_week, test_question)
    print(f"Detail chunking generated and saved to Excel")

if __name__ == "__main__":
    main()
