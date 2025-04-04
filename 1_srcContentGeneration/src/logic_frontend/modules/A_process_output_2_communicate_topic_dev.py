"""
A2_communicate_topic_dev.py

This module processes the learning path JSON output from A_FromUserProfileGenLearningPath.py
and generates a communicate_topic_dev.xlsx file containing structured scenario information.

Input:
    - JSON learning path data containing topics and scenarios
    - Format example:
        {
            "learning_path": [
                {
                    "week": 1,
                    "topic": "Team Meetings | Workplace communication",
                    "scenarios": [
                        {"scenario": "Thảo luận về lịch trình họp nhóm"},
                        ...
                    ]
                },
                ...
            ]
        }

Output:
    - communicate_topic_dev.xlsx file with columns:
        - communicate_stage_id: Numbers from 1 to 10 (matching the week number)
        - id: Sequential number from 1 to 100
        - order: Sequential number from 1 to 244
        - name: Scenario name from the learning path

Example Output:
    | communicate_stage_id | id | order | name                                |
    |---------------------|----|-------|------------------------------------|
    | 1                   | 1  | 1     | Thảo luận về lịch trình họp nhóm   |
    | 1                   | 2  | 2     | Đề xuất chủ đề cho cuộc họp nhóm   |
    | ...                 | ...| ...   | ...                                |
    | 10                  | 100| 244   | Đưa ra kế hoạch học tập và phát triển|
"""

import json
import pandas as pd
from pathlib import Path
from typing import Dict, List

class CommunicateTopicDevGenerator:
    def __init__(self):
        """Initialize the generator with output directory setup."""
        self.output_dir = Path("output")
        self.output_dir.mkdir(exist_ok=True)

    def generate_communicate_topic_dev(self, learning_path: Dict) -> None:
        """
        Generate communicate topic dev Excel file from learning path data.
        
        Args:
            learning_path (Dict): Learning path data containing topics and scenarios
        """
        topic_dev_data = []
        order_counter = 1
        
        # Process learning path data
        if "learning_path" in learning_path:
            for week in learning_path["learning_path"]:
                communicate_stage_id = week["week"]
                
                for scenario in week["scenarios"]:
                    topic_dev_data.append({
                        "communicate_stage_id": communicate_stage_id,
                        "id": len(topic_dev_data) + 1,  # Sequential ID from 1 to 100
                        "order": order_counter,  # Sequential order from 1 to 244
                        "name": scenario["scenario"]
                    })
                    order_counter += 1

        # Create DataFrame and save to Excel
        df_topic_dev = pd.DataFrame(topic_dev_data)
        
        # Ensure we only have 100 rows for id
        df_topic_dev = df_topic_dev.head(100)
        
        # Save to Excel
        df_topic_dev.to_excel(
            self.output_dir / "communicate_topic_dev.xlsx",
            index=False
        )

def main():
    """
    Main function to demonstrate usage of the CommunicateTopicDevGenerator.
    """
    # Read data from JSON file
    import json
    from pathlib import Path
    
    json_path = Path(__file__).parent / "learning_path_data.json.example"
    with open(json_path, 'r', encoding='utf-8') as f:
        learning_path_data = json.load(f)
    
    # Generate communicate topic dev
    generator = CommunicateTopicDevGenerator()
    generator.generate_communicate_topic_dev(learning_path_data)
    print("Communicate topic dev Excel file generated in output directory")

if __name__ == "__main__":
    main() 