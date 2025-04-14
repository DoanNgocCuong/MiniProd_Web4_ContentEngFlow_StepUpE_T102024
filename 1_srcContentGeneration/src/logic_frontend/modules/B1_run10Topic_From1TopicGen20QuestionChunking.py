import concurrent.futures
import json
import requests
from typing import Dict, List
from pathlib import Path
from datetime import datetime
import pandas as pd
import sys
from pathlib import Path
import glob

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

        # Count total questions
        total_questions = sum(len(scenario["questions"]) for scenario in chunking["scenarios"])
        print(f"Generated {total_questions} questions for week {week_data['week']}")

        # Save to Excel
        excel_file = self._save_to_excel(week_data["week"], chunking)

        return excel_file

    def _save_to_excel(self, week: int, chunking: Dict) -> str:
        """
        Save chunking questions to Excel file and JSON file
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

        # Save to JSON
        json_file = self.output_dir / f"B1_chunking_week_{week}_{timestamp}.json"
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        return str(excel_file)

    def merge_weekly_excel_files(self) -> str:
        """
        Merge all weekly Excel files into a single file, sorted by week
        """
        # Get all B1 chunking Excel files
        excel_files = glob.glob(str(self.output_dir / "B1_chunking_week_*.xlsx"))
        
        if not excel_files:
            raise ValueError("No Excel files found to merge")

        # Read all Excel files and combine them
        all_data = []
        for file in excel_files:
            df = pd.read_excel(file)
            all_data.append(df)

        # Combine all dataframes
        combined_df = pd.concat(all_data, ignore_index=True)
        
        # Sort by Week
        combined_df = combined_df.sort_values(by="Week")

        # Save combined Excel file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        combined_excel_file = self.output_dir / f"B1_chunking_all_weeks_{timestamp}.xlsx"
        combined_df.to_excel(combined_excel_file, index=False)

        # Save combined JSON file
        combined_json_file = self.output_dir / f"B1_chunking_all_weeks_{timestamp}.json"
        with open(combined_json_file, 'w', encoding='utf-8') as f:
            json.dump(combined_df.to_dict('records'), f, ensure_ascii=False, indent=2)

        # Print total questions
        total_questions = len(combined_df)
        print(f"\nTotal questions in combined file: {total_questions}")

        # Clean up individual weekly files
        self._cleanup_weekly_files(excel_files)

        return str(combined_excel_file)

    def _cleanup_weekly_files(self, excel_files: List[str]):
        """
        Clean up individual weekly Excel and JSON files after merging
        """
        try:
            for file in excel_files:
                file_path = Path(file)
                if file_path.exists():
                    file_path.unlink()
                    print(f"Deleted weekly file: {file}")
                
                # Delete corresponding JSON file
                json_file = file_path.with_suffix('.json')
                if json_file.exists():
                    json_file.unlink()
                    print(f"Deleted JSON file: {json_file}")
        except Exception as e:
            print(f"Error cleaning up weekly files: {str(e)}")

def process_week(week_data: Dict, user_profile: UserProfile) -> str:
    """
    Process a single week's data
    """
    generator = ChunkingGenerator()
    excel_file = generator.generate_chunking(user_profile, week_data)
    print(f"Generated chunking questions for week {week_data['week']}")
    return excel_file

def main():
    # Create user profile
    user_profile = UserProfile(
        industry="IT",
        job="CTO",
        gender="Male",
        native_language="Vietnamese",
        english_level="A2",
        learning_goals=["workplace communication", "job interviews", "salary review"]
    )

    # Read learning path data from JSON file
    json_path = Path(__file__).parent / "output" / "learning_path_data.json"
    with open(json_path, 'r', encoding='utf-8') as f:
        learning_path_data = json.load(f)

    # Process all weeks in parallel
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        # Submit all tasks
        futures = [
            executor.submit(process_week, week_data, user_profile)
            for week_data in learning_path_data["learning_path"]
        ]
        
        # Wait for all tasks to complete
        concurrent.futures.wait(futures)
        
        # Check for any exceptions
        for future in futures:
            try:
                future.result()
            except Exception as e:
                print(f"Error processing week: {e}")

    # Merge all weekly files into one
    generator = ChunkingGenerator()
    combined_file = generator.merge_weekly_excel_files()
    print(f"All weeks processed and combined into: {combined_file}")

if __name__ == "__main__":
    main()
