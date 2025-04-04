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

class ChunkingGenerator:
    def __init__(self, base_url: str = "http://103.253.20.13:3000"):
        self.base_url = base_url
        self.output_dir = Path("output")
        self.output_dir.mkdir(exist_ok=True)

    def generate_chunking(self, user_profile: Dict, week_data: Dict) -> Dict:
        """
        Generate 20 chunking questions from a topic
        """
        # Format the input according to API requirements
        formatted_input = {
            "userProfile5Scenario": f"USER PROFILE:\n"
                                  f"- Industry: [{user_profile.industry}]\n"
                                  f"- Job: [{user_profile.job}]\n"
                                  f"- English Level: [{user_profile.english_level}]\n"
                                  f"- Learning Goals: {' '.join([f'[{goal}]' for goal in user_profile.learning_goals])}\n"
                                  f"---\n{json.dumps(week_data)}"
        }

        # Call API
        response = requests.post(
            f"{self.base_url}/api/generate-20-chunking-from-5-scenario",
            json=formatted_input
        )
        response.raise_for_status()
        
        # Parse response
        result = response.json()
        chunking = json.loads(result["chunkingPhrases"])

        # Save to Excel
        self._save_to_excel(week_data["week"], chunking)

        return chunking

    def _save_to_excel(self, week: int, chunking: Dict) -> str:
        """
        Save chunking questions to Excel file
        """
        # Prepare data for Excel
        data = []
        for scenario in chunking["scenarios"]:
            for question in scenario["questions"]:
                data.append({
                    "Week": week,
                    "Topic": chunking["topic"],
                    "Scenario": scenario["scenario"],
                    "Question": question
                })

        # Create DataFrame
        df = pd.DataFrame(data)

        # Save to Excel
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        excel_file = self.output_dir / f"B1_chunking_week_{week}_{timestamp}.xlsx"
        df.to_excel(excel_file, index=False)

        return str(excel_file)

def main():
    # Example usage
    # Create user profile
    user_profile = UserProfile(
        industry="IT",
        job="CTO",
        gender="Male",
        native_language="Vietnamese",
        english_level="A2",
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

    # Generate chunking
    generator = ChunkingGenerator()
    chunking = generator.generate_chunking(user_profile, test_week)
    print(f"Chunking questions generated and saved to Excel")

if __name__ == "__main__":
    main()
