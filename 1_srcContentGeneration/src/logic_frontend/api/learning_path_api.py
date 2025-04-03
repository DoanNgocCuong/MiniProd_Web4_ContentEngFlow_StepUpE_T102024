from typing import Dict
from .base_api import BaseAPI
from ..models.user_profile import UserProfile

class LearningPathAPI(BaseAPI):
    def generate_learning_path(self, user_profile: UserProfile) -> Dict:
        """Generate learning path from user profile"""
        endpoint = "/api/generate-learning-path"
        payload = {"userProfile": user_profile.to_api_format()}
        return self._make_api_request(endpoint, payload) 