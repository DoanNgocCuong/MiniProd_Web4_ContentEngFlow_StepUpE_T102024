from typing import List

class UserProfile:
    def __init__(self, 
                 industry: str,
                 job: str,
                 gender: str,
                 native_language: str,
                 english_level: str,
                 learning_goals: List[str]):
        self.industry = industry
        self.job = job
        self.gender = gender
        self.native_language = native_language
        self.english_level = english_level
        self.learning_goals = learning_goals

    def to_api_format(self) -> str:
        """Convert user profile to API format"""
        return f"""Industry: {self.industry}
Job: {self.job}
Gender: {self.gender}
Native Language: {self.native_language}
English Level: {self.english_level}
Learning Goals: {', '.join(self.learning_goals)}""" 