import json
import requests
from typing import Dict, List
from pathlib import Path
from datetime import datetime
import pandas as pd
import sys
import logging
from pathlib import Path
import time

# Add parent directory to Python path
sys.path.append(str(Path(__file__).parent.parent))
from models.user_profile import UserProfile

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('exercise_generator.log'),
        logging.StreamHandler()
    ]
)

class ExerciseGenerator:
    def __init__(self, base_url: str = "http://103.253.20.13:3000"):
        self.base_url = base_url
        self.output_dir = Path("output")
        self.output_dir.mkdir(exist_ok=True)
        logging.info(f"ExerciseGenerator initialized with base_url: {base_url}")

    def generate_exercises(self, detail_chunking: Dict, max_retries: int = 3) -> Dict:
        """
        Generate 4 types of exercises from detail chunking with retry mechanism
        """
        logging.info("Starting exercise generation process")
        logging.debug(f"Input detail_chunking: {json.dumps(detail_chunking, indent=2)}")

        # Format the input according to API requirements
        formatted_input = {
            "lessons": [{
                "question": detail_chunking.get("question", ""),
                "structure": detail_chunking.get("structure", ""),
                "main phrase": detail_chunking.get("main_phrase", ""),
                "optional phrase 1": detail_chunking.get("optional_phrase_1", ""),
                "optional phrase 2": detail_chunking.get("optional_phrase_2", ""),
                "question-vi": detail_chunking.get("question_vi", ""),
                "structure-vi": detail_chunking.get("structure_vi", ""),
                "main phrase-vi": detail_chunking.get("main_phrase_vi", ""),
                "optional phrase 1-vi": detail_chunking.get("optional_phrase_1_vi", ""),
                "optional phrase 2-vi": detail_chunking.get("optional_phrase_2_vi", ""),
                "lesson_id": detail_chunking.get("lesson_id", "")
            }]
        }

        try:
            # Generate all 4 types of exercises with retry mechanism
            logging.info("Generating Meaning Exercises...")
            meaning_exercises = self._generate_with_retry(
                self._generate_meaning_exercises,
                formatted_input,
                max_retries
            )
            logging.info(f"Generated {len(meaning_exercises)} Meaning Exercises")

            logging.info("Generating Card Exercises...")
            card_exercises = self._generate_with_retry(
                self._generate_card_exercises,
                formatted_input,
                max_retries
            )
            logging.info(f"Generated {len(card_exercises)} Card Exercises")

            logging.info("Generating Flexible Exercises...")
            flexible_exercises = self._generate_with_retry(
                self._generate_flexible_exercises,
                formatted_input,
                max_retries
            )
            logging.info(f"Generated {len(flexible_exercises)} Flexible Exercises")

            logging.info("Generating Q&A Exercises...")
            qna_exercises = self._generate_with_retry(
                self._generate_qna_exercises,
                formatted_input,
                max_retries
            )
            logging.info(f"Generated {len(qna_exercises)} Q&A Exercises")

            # Save all exercises to Excel
            logging.info("Saving all exercises to Excel...")
            excel_path, json_path = self._save_to_excel(
                detail_chunking.get("week", 0),
                meaning_exercises,
                card_exercises,
                flexible_exercises,
                qna_exercises
            )
            logging.info(f"Exercises saved to Excel file: {excel_path}")
            logging.info(f"Exercises saved to JSON file: {json_path}")

            return {
                "meaning": meaning_exercises,
                "card": card_exercises,
                "flexible": flexible_exercises,
                "qna": qna_exercises
            }

        except Exception as e:
            logging.error(f"Error in generate_exercises: {str(e)}", exc_info=True)
            raise

    def _generate_with_retry(self, generate_func, input_data: Dict, max_retries: int = 3) -> List[Dict]:
        """
        Helper function to retry exercise generation
        """
        for attempt in range(max_retries):
            try:
                time.sleep(2)  # Add delay between requests
                result = generate_func(input_data)
                if result:
                    return result
                logging.warning(f"Attempt {attempt + 1} returned empty result")
            except Exception as e:
                logging.error(f"Attempt {attempt + 1} failed: {str(e)}")
                if attempt == max_retries - 1:
                    logging.error(f"Max retries reached for {generate_func.__name__}")
                    return []
                time.sleep(5)  # Wait longer between retries
        return []

    def _generate_meaning_exercises(self, formatted_input: Dict) -> List[Dict]:
        """Generate learning meaning exercises"""
        try:
            logging.debug("Calling generate-learning-meaning API...")
            response = requests.post(
                f"{self.base_url}/api/generate-learning-meaning",
                json=formatted_input,
                timeout=120
            )
            response.raise_for_status()
            result = response.json()
            logging.debug(f"API Response: {json.dumps(result, indent=2)}")
            
            if isinstance(result, list):
                logging.info("API returned list directly")
                return result
            return result.get("exercises", [])
        except Exception as e:
            logging.error(f"Error in _generate_meaning_exercises: {str(e)}", exc_info=True)
            raise

    def _generate_card_exercises(self, formatted_input: Dict) -> List[Dict]:
        """Generate learning card exercises"""
        try:
            logging.debug("Calling generate-learning-card API...")
            response = requests.post(
                f"{self.base_url}/api/generate-learning-card",
                json=formatted_input,
                timeout=120
            )
            response.raise_for_status()
            result = response.json()
            logging.debug(f"API Response: {json.dumps(result, indent=2)}")
            
            if isinstance(result, list):
                logging.info("API returned list directly")
                return result
            return result.get("exercises", [])
        except Exception as e:
            logging.error(f"Error in _generate_card_exercises: {str(e)}", exc_info=True)
            raise

    def _generate_flexible_exercises(self, formatted_input: Dict) -> List[Dict]:
        """Generate flexible phrase exercises"""
        try:
            logging.debug("Calling generate-learning-flexible API...")
            response = requests.post(
                f"{self.base_url}/api/generate-learning-flexible",
                json=formatted_input,
                timeout=120
            )
            response.raise_for_status()
            result = response.json()
            logging.debug(f"API Response: {json.dumps(result, indent=2)}")
            
            if isinstance(result, list):
                logging.info("API returned list directly")
                return result
            return result.get("exercises", [])
        except Exception as e:
            logging.error(f"Error in _generate_flexible_exercises: {str(e)}", exc_info=True)
            raise

    def _generate_qna_exercises(self, formatted_input: Dict) -> List[Dict]:
        """Generate Q&A exercises"""
        try:
            logging.debug("Calling generate-learning-qna API...")
            response = requests.post(
                f"{self.base_url}/api/generate-learning-qna",
                json=formatted_input,
                timeout=120
            )
            response.raise_for_status()
            result = response.json()
            logging.debug(f"API Response: {json.dumps(result, indent=2)}")
            
            if isinstance(result, list):
                logging.info("API returned list directly")
                return result
            return result.get("exercises", [])
        except Exception as e:
            logging.error(f"Error in _generate_qna_exercises: {str(e)}", exc_info=True)
            raise

    def _save_to_excel(self, week: int, meaning_exercises: List[Dict], 
                      card_exercises: List[Dict], flexible_exercises: List[Dict],
                      qna_exercises: List[Dict]) -> str:
        """
        Save all exercises to Excel file with separate sheets
        """
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            excel_file = self.output_dir / f"D_exercises_week_{week}_{timestamp}.xlsx"
            logging.info(f"Creating Excel file: {excel_file}")
            
            # Create Excel writer
            with pd.ExcelWriter(excel_file, engine='openpyxl') as writer:
                # Save Meaning Exercises
                logging.info("Saving Meaning Exercises sheet...")
                meaning_data = []
                for exercise in meaning_exercises:
                    meaning_data.append({
                        "sentence": exercise.get("sentence", ""),
                        "answer_1": exercise.get("answer_1", ""),
                        "answer_2": exercise.get("answer_2", ""),
                        "answer_3": exercise.get("answer_3", ""),
                        "answer_2_description": exercise.get("answer_2_description", ""),
                        "answer_3_description": exercise.get("answer_3_description", "")
                    })
                pd.DataFrame(meaning_data).to_excel(writer, sheet_name="Meaning Exercises", index=False)

                # Save Card Exercises
                logging.info("Saving Card Exercises sheet...")
                card_data = []
                for exercise in card_exercises:
                    card_data.append({
                        "sentence_en": exercise.get("sentence_en", ""),
                        "sentence_vi": exercise.get("sentence_vi", ""),
                        "ipa": exercise.get("ipa", "")
                    })
                pd.DataFrame(card_data).to_excel(writer, sheet_name="Card Exercises", index=False)

                # Save Flexible Exercises
                logging.info("Saving Flexible Exercises sheet...")
                flexible_data = []
                for exercise in flexible_exercises:
                    flexible_data.append({
                        "description": exercise.get("description", ""),
                        "sentence_hide": exercise.get("sentence_hide", ""),
                        "sentence_en": exercise.get("sentence_en", ""),
                        "sentence_vi": exercise.get("sentence_vi", "")
                    })
                pd.DataFrame(flexible_data).to_excel(writer, sheet_name="Flexible Exercises", index=False)

                # Save Q&A Exercises
                logging.info("Saving Q&A Exercises sheet...")
                qna_data = []
                for exercise in qna_exercises:
                    qna_data.append({
                        "description": exercise.get("description", ""),
                        "sentence_en": exercise.get("sentence_en", ""),
                        "sentence_hide": exercise.get("sentence_hide", "")
                    })
                pd.DataFrame(qna_data).to_excel(writer, sheet_name="Q&A Exercises", index=False)

            # Save to JSON
            json_file = self.output_dir / f"D_exercises_week_{week}_{timestamp}.json"
            logging.info(f"Creating JSON file: {json_file}")
            
            exercises_data = {
                "week": week,
                "meaning_exercises": meaning_exercises,
                "card_exercises": card_exercises,
                "flexible_exercises": flexible_exercises,
                "qna_exercises": qna_exercises
            }
            
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(exercises_data, f, ensure_ascii=False, indent=2)

            logging.info(f"Successfully saved all exercises to {excel_file} and {json_file}")
            return str(excel_file), str(json_file)

        except Exception as e:
            logging.error(f"Error in _save_to_excel: {str(e)}", exc_info=True)
            raise

def main():
    try:
        logging.info("Starting exercise generation process")
        # Create test detail chunking data
        test_detail = {
            "week": 1,
            "question": "How do you say hello in English?",
            "structure": "You say hello by ____.",
            "main_phrase": "saying hello",
            "optional_phrase_1": "waving your hand",
            "optional_phrase_2": "smiling at someone",
            "question_vi": "Bạn nói hello bằng cách nào trong tiếng Anh?",
            "structure_vi": "Bạn nói hello bằng cách ____.",
            "main_phrase_vi": "nói hello",
            "optional_phrase_1_vi": "vẫy tay",
            "optional_phrase_2_vi": "mỉm cười với ai đó",
            "lesson_id": "hello_1257_03042025"
        }
        logging.debug(f"Test detail data: {json.dumps(test_detail, indent=2)}")

        # Generate exercises
        generator = ExerciseGenerator()
        exercises = generator.generate_exercises(test_detail)
        logging.info("Exercise generation completed successfully")
        print(f"All exercises generated and saved to Excel and JSON")

    except Exception as e:
        logging.error(f"Error in main: {str(e)}", exc_info=True)
        raise

if __name__ == "__main__":
    main()
