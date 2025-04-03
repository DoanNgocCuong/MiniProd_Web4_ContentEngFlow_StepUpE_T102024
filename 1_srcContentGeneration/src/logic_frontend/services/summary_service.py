import json
from typing import Dict, List
from pathlib import Path
from datetime import datetime

class SummaryService:
    def __init__(self, output_dir: str = "output"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)

    def create_summary(self, user_profile: Dict, learning_path: List[Dict], 
                      chunking_results: List[Dict], detail_results: List[Dict], 
                      exercise_results: List[Dict]) -> str:
        """
        Create a summary of the content generation process
        """
        summary = {
            "user_profile": user_profile,
            "learning_path": learning_path,
            "chunking_results": chunking_results,
            "detail_results": detail_results,
            "exercise_results": exercise_results
        }

        # Save summary to file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        summary_file = self.output_dir / f"summary_{timestamp}.json"
        
        with open(summary_file, "w", encoding="utf-8") as f:
            json.dump(summary, f, ensure_ascii=False, indent=2)
        
        return str(summary_file) 