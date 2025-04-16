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
            total=5,
            backoff_factor=3,
            status_forcelist=[500, 502, 503, 504],
            allowed_methods=['POST']
        )
        self.session.mount('http://', HTTPAdapter(max_retries=retries))

    def generate_detail_chunking(self, user_profile: Dict, week_data: Dict, question_data: Dict, max_retries: int = 3) -> Dict:
        """
        Generate detail chunking from a question with retry mechanism
        """
        if self.should_stop:
            return None

        for attempt in range(max_retries):
            try:
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

                # Add delay between requests
                time.sleep(2)
                
                # Call API with retry mechanism
                response = self.session.post(
                    f"{self.base_url}/api/generate-questions",
                    json=formatted_input,
                    timeout=120
                )
                
                response.raise_for_status()
                result = response.json()
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
                print(f"Attempt {attempt + 1} failed for question: {question_data['question']}")
                print(f"Error details: {str(e)}")
                if attempt == max_retries - 1:
                    print(f"Max retries reached for question: {question_data['question']}")
                    return None
                time.sleep(5)  # Wait longer between retries

        return None

    def save_final_files(self, all_results: List[Dict]) -> tuple:
        """
        Save all results to final Excel and JSON files
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
            if result:
                row_data = {col: result.get(col, "") for col in columns}
                data.append(row_data)
        
        df = pd.DataFrame(data)
        df = df.sort_values(by=["week", "scenario"])

        # Save to Excel
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        excel_file = self.output_dir / f"C_all_details_{timestamp}.xlsx"
        df.to_excel(excel_file, index=False)

        # Save to JSON
        json_file = self.output_dir / f"C_all_details_{timestamp}.json"
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        return str(excel_file), str(json_file)

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

        # Read questions from B1 output JSON file
        b1_json_path = Path(__file__).parent / "output" / "B1_chunking_all_weeks_20250414_100316.json"
        with open(b1_json_path, 'r', encoding='utf-8') as f:
            b1_questions = json.load(f)

        # Read learning path data
        json_path = Path(__file__).parent / "output" / "learning_path_data.json"
        with open(json_path, 'r', encoding='utf-8') as f:
            learning_path_data = json.load(f)

        generator = DetailChunkingGenerator()
        
        # Prepare all questions
        all_questions = []
        for question in b1_questions:
            week_data = next((w for w in learning_path_data["learning_path"] if w["week"] == question["Week"]), None)
            if not week_data:
                print(f"No week data found for week {question['Week']}")
                continue
                
            question_data = {
                "topic": question["Topic"],
                "scenario": question["Scenario"],
                "question": question["Question"]
            }
            all_questions.append((generator, user_profile, week_data, question_data))

        print(f"Total questions to process: {len(all_questions)}")

        # Process questions in parallel batches
        results = []
        failed_questions = []
        batch_size = 20  # Process 20 questions at a time
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            for i in range(0, len(all_questions), batch_size):
                if generator.should_stop:
                    break
                    
                batch = all_questions[i:i + batch_size]
                batch_futures = [executor.submit(process_question, args) for args in batch]
                
                # Wait for all futures in batch to complete
                for future in concurrent.futures.as_completed(batch_futures):
                    try:
                        result = future.result()
                        if result:
                            results.append(result)
                            print(f"Processed {len(results)}/{len(all_questions)} questions")
                        else:
                            # Get the question that failed
                            question_data = batch[batch_futures.index(future)][3]
                            failed_questions.append(question_data)
                            print(f"Failed to process question: {question_data['question']}")
                    except Exception as e:
                        print(f"Error in batch processing: {str(e)}")
                
                if not generator.should_stop:
                    print(f"Completed batch {i//batch_size + 1}/{(len(all_questions) + batch_size - 1)//batch_size}")

        # Save final results
        if results:
            excel_file, json_file = generator.save_final_files(results)
            print(f"All questions processed and saved to:")
            print(f"Excel file: {excel_file}")
            print(f"JSON file: {json_file}")
            print(f"Total questions processed: {len(results)}")
            
            # Save failed questions if any
            if failed_questions:
                failed_file = generator.output_dir / f"failed_questions_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
                with open(failed_file, 'w', encoding='utf-8') as f:
                    json.dump(failed_questions, f, ensure_ascii=False, indent=2)
                print(f"Failed questions saved to: {failed_file}")

    except KeyboardInterrupt:
        print("\nGracefully shutting down...")
        if 'results' in locals() and results:
            excel_file, json_file = generator.save_final_files(results)
            print(f"Saved partial results to:")
            print(f"Excel file: {excel_file}")
            print(f"JSON file: {json_file}")
        sys.exit(0)
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
