import streamlit as st
import requests
import json
from datetime import datetime
from abc import ABC, abstractmethod

class BaseGenerator(ABC):
    """Base class for all generators with common functionality."""
    
    def __init__(self, api_endpoint: str):
        self.api_endpoint = api_endpoint
        
    def _make_api_request(self, payload: dict) -> dict:
        """Make API request and handle common errors."""
        try:
            response = requests.post(
                self.api_endpoint,
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            st.error(f"API request error: {str(e)}")
            return None
        except json.JSONDecodeError as e:
            st.error(f"Error parsing response: {str(e)}")
            return None
        except Exception as e:
            st.error(f"Unexpected error: {str(e)}")
            return None

    def _format_user_profile(self, industry: str, job_role: str, english_level: str, learning_goals: str) -> str:
        """Format user profile in the required structure."""
        return f"""Industry: [{industry}]
Job: [{job_role}]
Gender: Male
Native language: Vietnamese
English Level: [{english_level}]
Learning goals: [{learning_goals}]"""

    def _download_json(self, data: dict, filename_prefix: str):
        """Download data as JSON file."""
        st.download_button(
            label=f"Download {filename_prefix}",
            data=json.dumps(data, indent=2),
            file_name=f"{filename_prefix}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
            mime="application/json"
        )

    @abstractmethod
    def render(self):
        """Render the generator interface."""
        pass

    @abstractmethod
    def generate(self, **kwargs):
        """Generate content based on input parameters."""
        pass 