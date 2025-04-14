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
        Generate detail chunking from a question
        """
        # Format the input according to API requirements
        formatted_input = {
            "generateQuestionInput": f"Generate detailed content for a specific question.\n"
                                   f"# Prepare user profile\n"
                                   f"user_profile = f\"\"\"USER PROFILE:\n"
                                   f"- industry: [{user_profile.industry}]\n"
                                   f"- job: [{user_profile.job}]\n"
                                   f"- englishLevel: [{user_profile.english_level}]\n"
                                   f"- learningGoals: {' '.join([f'[{goal}]' for goal in user_profile.learning_goals])}\"\"\"\n\n"
                                   f"# Prepare question data\n"
                                   f"question_data = {json.dumps(question_data)}"
        }

        # Call API
        response = requests.post(
            f"{self.base_url}/api/generate-questions",
            json=formatted_input
        )
        response.raise_for_status()
        
        # Parse response
        result = response.json()
        
        # Extract the question details
        question_details = result["questions"][0]
        
        # Add metadata
        question_details.update({
            "week": week_data["week"],
            "topic": week_data["topic"],
            "scenario": question_data["scenario"],
            "original_question": question_data["question"]
        })

        # Save to Excel
        self._save_to_excel(question_details)

        return question_details

    def _save_to_excel(self, question_details: Dict) -> str:
        """
        Save detail chunking to Excel file with proper column structure
        """
        # Define the columns we want to save
        columns = [
            "week", "topic", "scenario", "original_question",
            "question", "structure", "main phrase", "optional phrase 1", "optional phrase 2",
            "question-vi", "structure-vi", "main phrase-vi", "optional phrase 1-vi", "optional phrase 2-vi"
        ]
        
        # Create a single row DataFrame
        data = {col: question_details.get(col, "") for col in columns}
        df = pd.DataFrame([data])

        # Save to Excel
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        excel_file = self.output_dir / f"C_detail_week_{question_details['week']}_{timestamp}.xlsx"
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
    print(json.dumps(detail, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
