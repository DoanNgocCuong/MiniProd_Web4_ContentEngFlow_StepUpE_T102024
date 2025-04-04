"""
A1_communicate_stage.py

This module processes the learning path JSON output from A_FromUserProfileGenLearningPath.py
and generates a communicate_stage.xlsx file containing structured topic information.

Input:
    - JSON learning path data containing topics and scenarios
    - Format example:
        {
            "learning_path": [
                {
                    "week": 1,
                    "topic": "Team Meetings | Workplace communication",
                    "scenarios": [...]
                },
                ...
            ]
        }

Output:
    - communicate_stage.xlsx file with columns:
        - id: Sequential number from 1 to 10
        - order: Same as id
        - order_view: "Chủ đề 1", "Chủ đề 2", etc.
        - name: Topic name (without the learning goal part)
        - is_trial: Empty string
        - category_name: Same as name

Example Output:
    | id | order | order_view | name           | is_trial | category_name   |
    |----|-------|------------|----------------|----------|-----------------|
    | 1  | 1     | Chủ đề 1  | Team Meetings  |          | Team Meetings   |
    | 2  | 2     | Chủ đề 2  | Interview Q&A  |          | Interview Q&A   |
    | ...| ...   | ...       | ...            |          | ...             |
"""

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

class CommunicateStageGenerator:
    def __init__(self):
        """Initialize the generator with output directory setup."""
        self.output_dir = Path("output")
        self.output_dir.mkdir(exist_ok=True)

    def _clean_topic_name(self, topic: str) -> str:
        """
        Clean the topic name by removing the learning goal part.
        
        Args:
            topic (str): Full topic name (e.g., "Team Meetings | Workplace communication")
            
        Returns:
            str: Cleaned topic name (e.g., "Team Meetings")
        """
        return topic.split("|")[0].strip()

    def generate_communicate_stage(self, learning_path: Dict) -> None:
        """
        Generate communicate stage Excel file from learning path data.
        
        Args:
            learning_path (Dict): Learning path data containing topics and scenarios
        """
        communicate_data = []
        
        # Process learning path data
        if "learning_path" in learning_path:
            for index, week in enumerate(learning_path["learning_path"], start=1):
                # Clean the topic name by removing the learning goal part
                topic = self._clean_topic_name(week["topic"])
                
                communicate_data.append({
                    "id": index,
                    "order": index,
                    "order_view": f"Chủ đề {index}",
                    "name": topic,
                    "is_trial": "",
                    "category_name": topic
                })

        # Create DataFrame and save to Excel
        df_communicate = pd.DataFrame(communicate_data)
        
        # Ensure we only have 10 rows
        df_communicate = df_communicate.head(10)
        
        # Save to Excel
        df_communicate.to_excel(
            self.output_dir / "communicate_stage.xlsx",
            index=False
        )

def main():
    """
    Main function to demonstrate usage of the CommunicateStageGenerator.
    """
    # Read data from JSON file
    import json
    from pathlib import Path
    
    json_path = Path(__file__).parent / "learning_path_data.json.example"
    with open(json_path, 'r', encoding='utf-8') as f:
        learning_path_data = json.load(f)
    
    # Generate communicate stage
    generator = CommunicateStageGenerator()
    generator.generate_communicate_stage(learning_path_data)
    print("Communicate stage Excel file generated in output directory")

if __name__ == "__main__":
    main() 