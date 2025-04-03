import json
from typing import Dict
from .base_api import BaseAPI
from ..models.user_profile import UserProfile

class ChunkingAPI(BaseAPI):
    def generate_20_chunking(self, user_profile: UserProfile, week_data: Dict) -> Dict:
        """Generate 20 chunking questions from 5 scenarios"""
        endpoint = "/api/generate-20-chunking-from-5-scenario"
        payload = {
            "userProfile5Scenario": f"USER PROFILE:\n{user_profile.to_api_format()}\n---\n{json.dumps(week_data)}"
        }
        return self._make_api_request(endpoint, payload) 