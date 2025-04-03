from typing import Dict
from .base_api import BaseAPI

class ExercisesAPI(BaseAPI):
    def generate_learning_exercises(self, question_data: Dict) -> Dict:
        """Generate 4 types of learning exercises"""
        exercises = {}
        
        # 1. Learning Meaning Exercise
        endpoint = "/api/generate-learning-meaning"
        exercises["meaning"] = self._make_api_request(endpoint, {"questions": [question_data]})

        # 2. Learning Card Exercise
        endpoint = "/api/generate-learning-card"
        exercises["card"] = self._make_api_request(endpoint, question_data)

        # 3. Flexible Phrase Exercise
        endpoint = "/api/generate-learning-flexible"
        exercises["flexible"] = self._make_api_request(endpoint, question_data)

        # 4. Q&A Exercise
        endpoint = "/api/generate-learning-qna"
        exercises["qna"] = self._make_api_request(endpoint, question_data)

        return exercises 