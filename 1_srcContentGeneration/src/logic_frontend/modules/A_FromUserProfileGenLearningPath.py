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

class LearningPathGenerator:
    def __init__(self, base_url: str = "http://103.253.20.13:3000"):
        self.base_url = base_url
        self.output_dir = Path("output")
        self.output_dir.mkdir(exist_ok=True)

    def generate_learning_path(self, user_profile: Dict) -> Dict:
        """
        Generate learning path from user profile
        """
        # Prepare API payload
        payload = {
            "userProfile": user_profile.to_api_format()
        }

        # Call API
        response = requests.post(
            f"{self.base_url}/api/generate-learning-path",
            json=payload
        )
        response.raise_for_status()
        
        # Parse response
        result = response.json()
        learning_path = json.loads(result["learningPath"])

        # Save to Excel files
        self._save_to_excel(learning_path)

        return learning_path

    def _save_to_excel(self, learning_path: Dict) -> None:
        """
        Save learning path components to Excel files
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Save learning path if it exists
        if "learning_path" in learning_path:
            learning_path_data = []
            for week in learning_path["learning_path"]:
                for scenario in week["scenarios"]:
                    learning_path_data.append({
                        "Week": week["week"],
                        "Topic": week["topic"],
                        "Scenario": scenario["scenario"]
                    })
            
            df_learning_path = pd.DataFrame(learning_path_data)
            df_learning_path.to_excel(
                self.output_dir / f"A_learning_path_{timestamp}.xlsx",
                index=False
            )

        # Save communication partners if they exist
        if "communication_partners" in learning_path:
            partners_data = []
            for partner in learning_path["communication_partners"]:
                for scenario in partner["scenarios"]:
                    partners_data.append({
                        "Group": partner["group"],
                        "Scenario": scenario
                    })
            
            df_partners = pd.DataFrame(partners_data)
            df_partners.to_excel(
                self.output_dir / f"A_communication_partners_{timestamp}.xlsx",
                index=False
            )

        # Save milestones if they exist
        if "milestones" in learning_path:
            df_milestones = pd.DataFrame(learning_path["milestones"])
            df_milestones.to_excel(
                self.output_dir / f"A_milestones_{timestamp}.xlsx",
                index=False
            )

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

    # Generate learning path
    generator = LearningPathGenerator()
    learning_path = generator.generate_learning_path(user_profile)
    print(f"Learning path generated and saved to Excel files in output directory")

if __name__ == "__main__":
    main() 