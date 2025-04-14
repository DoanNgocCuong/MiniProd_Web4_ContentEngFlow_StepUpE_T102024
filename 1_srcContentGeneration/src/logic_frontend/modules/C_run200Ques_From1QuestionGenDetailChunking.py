import json
import requests
from typing import Dict, List
from pathlib import Path
from datetime import datetime
import pandas as pd
import sys
import concurrent.futures
from pathlib import Path
import glob
import time
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import signal
from collections import defaultdict

# Add parent directory to Python path
sys.path.append(str(Path(__file__).parent.parent))
from models.user_profile import UserProfile

class DetailChunkingGenerator:
    def __init__(self, base_url: str = "http://103.253.20.13:3000"):
        self.base_url = base_url
        self.output_dir = Path("output")
        self.output_dir.mkdir(exist_ok=True)
        self.should_stop = False
        
        # Configure retry mechanism
        self.session = requests.Session()
        retries = Retry(
            total=5,  # increase number of retries
            backoff_factor=3,  # increase wait time between retries
            status_forcelist=[500, 502, 503, 504],
            allowed_methods=['POST']  # only retry on POST requests
        )
        self.session.mount('http://', HTTPAdapter(max_retries=retries))

    def generate_detail_chunking(self, user_profile: Dict, week_data: Dict, question_data: Dict) -> Dict:
        """
        Generate detail chunking from a question
        """
        if self.should_stop:
            return None

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

        try:
            # Add delay between requests
            time.sleep(2)  # increase delay to 2 seconds
            
            # Call API with retry mechanism
            response = self.session.post(
                f"{self.base_url}/api/generate-questions",
                json=formatted_input,
                timeout=120  # increase timeout to 120 seconds
            )
            
            # Log response details for debugging
            print(f"Response status code: {response.status_code}")
            print(f"Response headers: {response.headers}")
            
            if response.status_code == 500:
                print(f"Server error response body: {response.text}")
            
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

            return question_details
        except Exception as e:
            print(f"Error processing question: {question_data['question']}")
            print(f"Error details: {str(e)}")
            return None

    def save_to_excel(self, all_results: List[Dict], is_final: bool = False) -> str:
        """
        Save all results to a single Excel file with proper column structure
        """
        # Define the columns we want to save
        columns = [
            "week", "topic", "scenario", "original_question",
            "question", "structure", "main phrase", "optional phrase 1", "optional phrase 2",
            "question-vi", "structure-vi", "main phrase-vi", "optional phrase 1-vi", "optional phrase 2-vi"
        ]
        
        # Create DataFrame from all results
        data = []
        for result in all_results:
            if result:  # Only include non-None results
                row_data = {col: result.get(col, "") for col in columns}
                data.append(row_data)
        
        df = pd.DataFrame(data)
        
        # Sort by week and scenario
        df = df.sort_values(by=["week", "scenario"])

        # Save to Excel
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        excel_file = self.output_dir / f"C_all_details_{timestamp}.xlsx"
        df.to_excel(excel_file, index=False)

        # If this is the final save, clean up temporary files
        if is_final:
            self._cleanup_temporary_files()

        return str(excel_file)

    def _cleanup_temporary_files(self):
        """
        Clean up temporary files in the output directory
        """
        try:
            # Get all Excel files in output directory
            temp_files = list(self.output_dir.glob("C_all_details_*.xlsx"))
            
            # Keep only the most recent file
            if temp_files:
                latest_file = max(temp_files, key=lambda x: x.stat().st_mtime)
                for file in temp_files:
                    if file != latest_file:
                        file.unlink()
                        print(f"Deleted temporary file: {file}")
        except Exception as e:
            print(f"Error cleaning up temporary files: {str(e)}")

def process_question(args: tuple) -> Dict:
    """
    Process a single question (for parallel processing)
    """
    generator, user_profile, week_data, question = args
    return generator.generate_detail_chunking(user_profile, week_data, question)

def signal_handler(signum, frame):
    print("\nReceived shutdown signal. Gracefully shutting down...")
    generator.should_stop = True

def main():
    global generator
    try:
        # Set up signal handler
        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)

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
        json_path = Path(__file__).parent / "learning_path_data.json"
        with open(json_path, 'r', encoding='utf-8') as f:
            learning_path_data = json.load(f)

        generator = DetailChunkingGenerator()
        
        # Prepare all questions from all weeks
        all_questions = []
        
        # Find the latest combined B1 file
        b1_files = list(Path("output").glob("B1_chunking_all_weeks_*.xlsx"))
        if not b1_files:
            raise FileNotFoundError("No B1 combined file found. Please run B1 generator first.")
            
        latest_b1_file = max(b1_files, key=lambda x: x.stat().st_mtime)
        print(f"Reading questions from: {latest_b1_file}")
        
        # Read the combined B1 file
        chunking_df = pd.read_excel(latest_b1_file)
        
        # Group by week and prepare questions
        for week_num, week_group in chunking_df.groupby("Week"):
            week_data = next((w for w in learning_path_data["learning_path"] if w["week"] == week_num), None)
            if not week_data:
                print(f"No week data found for week {week_num}")
                continue
                
            for _, row in week_group.iterrows():
                question_data = {
                    "topic": row["Topic"],
                    "scenario": row["Scenario"],
                    "question": row["Question"]
                }
                all_questions.append((generator, user_profile, week_data, question_data))

        print(f"Total questions to process: {len(all_questions)}")

        # Process questions in parallel but save results sequentially
        results = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            # Submit all tasks in smaller batches
            batch_size = 10
            for i in range(0, len(all_questions), batch_size):
                if generator.should_stop:
                    break
                    
                batch = all_questions[i:i + batch_size]
                futures = {executor.submit(process_question, args): args for args in batch}
                
                # Process results in order
                for future in concurrent.futures.as_completed(futures):
                    if generator.should_stop:
                        break
                    try:
                        result = future.result()
                        if result:
                            # Add result to the list in order
                            results.append(result)
                            # Save after each successful result
                            if len(results) % 5 == 0:  # Save every 5 results
                                intermediate_file = generator.save_to_excel(results)
                                print(f"Saved {len(results)} results to: {intermediate_file}")
                    except Exception as e:
                        print(f"Error in batch processing: {str(e)}")
                
                if not generator.should_stop:
                    print(f"Processed batch {i//batch_size + 1}/{(len(all_questions) + batch_size - 1)//batch_size}")

        # Save final results to a single Excel file
        if results:
            output_file = generator.save_to_excel(results, is_final=True)
            print(f"All questions processed and saved to: {output_file}")
            print(f"Total questions processed: {len(results)}")

    except KeyboardInterrupt:
        print("\nGracefully shutting down...")
        # Save any results we have so far
        if 'results' in locals() and results:
            output_file = generator.save_to_excel(results)
            print(f"Saved partial results to: {output_file}")
        sys.exit(0)
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
