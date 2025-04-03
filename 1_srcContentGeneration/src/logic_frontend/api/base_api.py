import requests
from typing import Dict

class BaseAPI:
    def __init__(self, base_url: str = "http://103.253.20.13:3000"):
        self.base_url = base_url

    def _make_api_request(self, endpoint: str, payload: Dict) -> Dict:
        """Make API request and handle response"""
        url = f"{self.base_url}{endpoint}"
        response = requests.post(url, json=payload)
        response.raise_for_status()
        return response.json() 