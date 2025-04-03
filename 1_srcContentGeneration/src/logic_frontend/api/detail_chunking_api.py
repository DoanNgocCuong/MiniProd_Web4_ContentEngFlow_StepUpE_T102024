import json
from typing import Dict
from .base_api import BaseAPI
from ..models.user_profile import UserProfile

class DetailChunkingAPI(BaseAPI):
    def generate_detail_chunking(self, user_profile: UserProfile, week_data: Dict, question_data: Dict) -> Dict:
        """Generate detailed chunking for a specific question"""
        endpoint = "/api/generate-questions"
        question_payload = {
            "topic": week_data["topic"],
            "scenario": question_data["scenario"],
            "question": question_data["question"]
        }
        payload = {
            "generateQuestionInput": f"Generate detailed content for a specific question.\n# Prepare user profile\nuser_profile = f\"\"\"USER PROFILE:\n{user_profile.to_api_format()}\"\"\"\n\n# Prepare question data\nquestion_data = {json.dumps(question_payload)}"
        }
        return self._make_api_request(endpoint, payload) 