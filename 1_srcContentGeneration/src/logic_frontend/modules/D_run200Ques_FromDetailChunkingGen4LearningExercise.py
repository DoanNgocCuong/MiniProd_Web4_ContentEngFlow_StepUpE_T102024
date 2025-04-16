import json
import requests
from typing import Dict, List
from pathlib import Path
from datetime import datetime
import pandas as pd
import sys
import concurrent.futures
import time
import signal
import logging
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Add parent directory to Python path
sys.path.append(str(Path(__file__).parent.parent))
from models.user_profile import UserProfile
from D_FromDetailChunkingGen4LearningExercise import ExerciseGenerator

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('exercise_generator.log'),
        logging.StreamHandler()
    ]
)

class ExerciseGeneratorManager:
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

    def process_detail_chunking(self, detail_chunking: Dict) -> Dict:
        """
        Process a single detail chunking to generate exercises
        """
        if self.should_stop:
            return None

        try:
            generator = ExerciseGenerator(self.base_url)
            exercises = generator.generate_exercises(detail_chunking)
            return exercises
        except Exception as e:
            logging.error(f"Error processing detail chunking: {str(e)}")
            return None

def process_detail_chunking(args: tuple) -> Dict:
    """
    Process a single detail chunking (for parallel processing)
    """
    manager, detail_chunking = args
    return manager.process_detail_chunking(detail_chunking)

def signal_handler(signum, frame):
    print("\nReceived shutdown signal. Gracefully shutting down...")
    manager.should_stop = True

def main():
    global manager
    try:
        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)

        # Read detail chunking data from C output
        c_json_path = Path(__file__).parent / "output" / "C_all_details_20250414_100316.json"
        with open(c_json_path, 'r', encoding='utf-8') as f:
            detail_chunkings = json.load(f)

        print(f"Processing {len(detail_chunkings)} detail chunkings")

        manager = ExerciseGeneratorManager()
        
        # Process detail chunkings in parallel batches
        results = []
        failed_chunkings = []
        batch_size = 20  # Process 20 questions at a time
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            for i in range(0, len(detail_chunkings), batch_size):
                if manager.should_stop:
                    break
                    
                batch = detail_chunkings[i:i + batch_size]
                batch_futures = [executor.submit(process_detail_chunking, (manager, chunking)) for chunking in batch]
                
                # Wait for all futures in batch to complete
                for future in concurrent.futures.as_completed(batch_futures):
                    try:
                        result = future.result()
                        if result:
                            results.append(result)
                            print(f"Processed {len(results)}/{len(detail_chunkings)} detail chunkings")
                        else:
                            # Get the chunking that failed
                            chunking = batch[batch_futures.index(future)]
                            failed_chunkings.append(chunking)
                            print(f"Failed to process detail chunking: {chunking['question']}")
                    except Exception as e:
                        print(f"Error in batch processing: {str(e)}")
                
                if not manager.should_stop:
                    print(f"Completed batch {i//batch_size + 1}/{(len(detail_chunkings) + batch_size - 1)//batch_size}")

        # Save final results
        if results:
            # Save to Excel
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            excel_file = manager.output_dir / f"D_exercises_{timestamp}.xlsx"
            
            with pd.ExcelWriter(excel_file, engine='openpyxl') as writer:
                # Save Meaning Exercises
                meaning_data = []
                for result in results:
                    for exercise in result.get("meaning", []):
                        meaning_data.append({
                            "Week": result.get("week", 0),
                            "Sentence": exercise.get("sentence", ""),
                            "Correct Answer": exercise.get("answer_1", ""),
                            "Wrong Answer 1": exercise.get("answer_2", ""),
                            "Wrong Answer 2": exercise.get("answer_3", ""),
                            "Explanation 1": exercise.get("answer_2_description", ""),
                            "Explanation 2": exercise.get("answer_3_description", "")
                        })
                pd.DataFrame(meaning_data).to_excel(writer, sheet_name="Meaning Exercises", index=False)

                # Save Card Exercises
                card_data = []
                for result in results:
                    for exercise in result.get("card", []):
                        card_data.append({
                            "Week": result.get("week", 0),
                            "English Sentence": exercise.get("sentence_en", ""),
                            "Vietnamese Translation": exercise.get("sentence_vi", ""),
                            "IPA Pronunciation": exercise.get("ipa", "")
                        })
                pd.DataFrame(card_data).to_excel(writer, sheet_name="Card Exercises", index=False)

                # Save Flexible Exercises
                flexible_data = []
                for result in results:
                    for exercise in result.get("flexible", []):
                        flexible_data.append({
                            "Week": result.get("week", 0),
                            "Description": exercise.get("description", ""),
                            "Hidden Sentence": exercise.get("sentence_hide", ""),
                            "English Sentence": exercise.get("sentence_en", ""),
                            "Vietnamese Translation": exercise.get("sentence_vi", "")
                        })
                pd.DataFrame(flexible_data).to_excel(writer, sheet_name="Flexible Exercises", index=False)

                # Save Q&A Exercises
                qna_data = []
                for result in results:
                    for exercise in result.get("qna", []):
                        qna_data.append({
                            "Week": result.get("week", 0),
                            "Description": exercise.get("description", ""),
                            "English Sentence": exercise.get("sentence_en", ""),
                            "Hidden Sentence": exercise.get("sentence_hide", "")
                        })
                pd.DataFrame(qna_data).to_excel(writer, sheet_name="Q&A Exercises", index=False)

            # Save to JSON
            json_file = manager.output_dir / f"D_exercises_{timestamp}.json"
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(results, f, ensure_ascii=False, indent=2)

            print(f"All exercises processed and saved to:")
            print(f"Excel file: {excel_file}")
            print(f"JSON file: {json_file}")
            print(f"Total detail chunkings processed: {len(results)}")
            
            # Save failed chunkings if any
            if failed_chunkings:
                failed_file = manager.output_dir / f"failed_chunkings_{timestamp}.json"
                with open(failed_file, 'w', encoding='utf-8') as f:
                    json.dump(failed_chunkings, f, ensure_ascii=False, indent=2)
                print(f"Failed chunkings saved to: {failed_file}")

    except KeyboardInterrupt:
        print("\nGracefully shutting down...")
        if 'results' in locals() and results:
            # Save partial results
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            excel_file = manager.output_dir / f"D_exercises_partial_{timestamp}.xlsx"
            json_file = manager.output_dir / f"D_exercises_partial_{timestamp}.json"
            
            # Save to Excel and JSON (similar to above)
            print(f"Saved partial results to:")
            print(f"Excel file: {excel_file}")
            print(f"JSON file: {json_file}")
        sys.exit(0)
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main() 