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

# Add parent directory to Python path
sys.path.append(str(Path(__file__).parent.parent))
from models.user_profile import UserProfile

class DetailChunkingGenerator:
    def __init__(self, base_url: str = "http://103.253.20.13:3000"):
        self.base_url = base_url
        self.output_dir = Path("output")
        self.output_dir.mkdir(exist_ok=True)
        self.all_results = []
        self.should_stop = False
        
        # Configure retry mechanism
        self.session = requests.Session()
        retries = Retry(
            total=3,  # number of retries
            backoff_factor=2,  # wait 2, 4, 8 seconds between retries
            status_forcelist=[500, 502, 503, 504]  # HTTP status codes to retry on
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
            time.sleep(1)  # 1 second delay between requests
            
            # Call API with retry mechanism
            response = self.session.post(
                f"{self.base_url}/api/generate-questions",
                json=formatted_input,
                timeout=60  # 60 seconds timeout
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

            return question_details
        except Exception as e:
            print(f"Error processing question: {question_data['question']}")
            print(f"Error details: {str(e)}")
            return None

    def save_to_excel(self, all_results: List[Dict]) -> str:
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

        return str(excel_file)

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
        all_questions = []

        # Prepare all questions from all weeks
        for week_data in learning_path_data["learning_path"]:
            # Get chunking data for this week
            chunking_file = glob.glob(str(Path("output") / f"B1_chunking_week_{week_data['week']}_*.xlsx"))
            if not chunking_file:
                print(f"No chunking file found for week {week_data['week']}")
                continue
                
            # Read the most recent chunking file
            latest_file = max(chunking_file)
            chunking_df = pd.read_excel(latest_file)
            
            # Prepare questions for this week
            for _, row in chunking_df.iterrows():
                question_data = {
                    "topic": row["Topic"],
                    "scenario": row["Scenario"],
                    "question": row["Question"]
                }
                all_questions.append((generator, user_profile, week_data, question_data))

        # Process questions in parallel with fewer workers
        results = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:  # Reduced from 10 to 5 workers
            # Submit all tasks in smaller batches
            batch_size = 10  # Reduced from 20 to 10
            for i in range(0, len(all_questions), batch_size):
                if generator.should_stop:
                    break
                    
                batch = all_questions[i:i + batch_size]
                futures = [executor.submit(process_question, args) for args in batch]
                
                # Wait for batch to complete
                for future in concurrent.futures.as_completed(futures):
                    if generator.should_stop:
                        break
                    try:
                        result = future.result()
                        if result:
                            results.append(result)
                    except Exception as e:
                        print(f"Error in batch processing: {str(e)}")
                
                if not generator.should_stop:
                    print(f"Processed batch {i//batch_size + 1}/{(len(all_questions) + batch_size - 1)//batch_size}")
                    
                    # Save intermediate results after each batch
                    if results:
                        intermediate_file = generator.save_to_excel(results)
                        print(f"Saved intermediate results to: {intermediate_file}")

        # Save final results to a single Excel file
        if results:
            output_file = generator.save_to_excel(results)
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
