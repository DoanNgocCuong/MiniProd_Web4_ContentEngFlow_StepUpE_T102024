import sys
from pathlib import Path
import json

# Add the project root directory to Python path
project_root = Path(__file__).parent.parent.parent
sys.path.append(str(project_root))

from src.logic_frontend.content_generation_flow import ContentGenerationFlow
from src.logic_frontend.models.user_profile import UserProfile
from src.logic_frontend.services.summary_service import SummaryService

def test_single_week():
    # Create test user profile
    user_profile = UserProfile(
        industry="IT",
        job="CTO",
        gender="Male",
        native_language="Vietnamese",
        english_level="A2",
        learning_goals=["workplace communication", "job interviews", "salary review"]
    )

    # Create test week data
    test_week = {
        "week": 1,
        "topic": "Workplace Communication",
        "scenarios": [
            {
                "scenario": "Meeting with team",
                "questions": [
                    "How to start a team meeting?",
                    "How to present ideas in a meeting?",
                    "How to handle questions in a meeting?",
                    "How to end a meeting effectively?"
                ]
            },
            {
                "scenario": "Email communication",
                "questions": [
                    "How to write a professional email?",
                    "How to respond to a work email?",
                    "How to request information via email?",
                    "How to follow up on an email?"
                ]
            },
            {
                "scenario": "Project discussion",
                "questions": [
                    "How to discuss project progress?",
                    "How to report project issues?",
                    "How to request project resources?",
                    "How to present project results?"
                ]
            },
            {
                "scenario": "Client meeting",
                "questions": [
                    "How to prepare for a client meeting?",
                    "How to present to a client?",
                    "How to handle client questions?",
                    "How to close a client meeting?"
                ]
            },
            {
                "scenario": "Team collaboration",
                "questions": [
                    "How to collaborate with team members?",
                    "How to give feedback to team members?",
                    "How to receive feedback from team members?",
                    "How to resolve team conflicts?"
                ]
            }
        ]
    }

    # Create learning path with only one week
    learning_path = {
        "learning_path": [test_week]
    }

    # Initialize flow with test data
    flow = ContentGenerationFlow(max_workers=20)
    
    # Override the learning path generation
    flow.learning_path_api.generate_learning_path = lambda _: {
        "learningPath": json.dumps(learning_path)
    }

    # Process the test week
    flow.process_user_profile(user_profile)

if __name__ == "__main__":
    test_single_week() 