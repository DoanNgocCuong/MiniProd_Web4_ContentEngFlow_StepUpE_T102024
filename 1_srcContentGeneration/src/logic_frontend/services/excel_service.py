import os
import pandas as pd
from typing import Dict
from datetime import datetime

class ExcelService:
    def __init__(self, output_dir: str = "output"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)

    def save_to_excel(self, data: Dict, filename: str) -> str:
        """Save data to Excel file"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filepath = os.path.join(self.output_dir, f"{filename}_{timestamp}.xlsx")
        
        with pd.ExcelWriter(filepath) as writer:
            for sheet_name, sheet_data in data.items():
                if isinstance(sheet_data, list):
                    df = pd.DataFrame(sheet_data)
                else:
                    df = pd.DataFrame([sheet_data])
                df.to_excel(writer, sheet_name=sheet_name, index=False)
        
        return filepath

    def create_summary_file(self):
        """Create a summary Excel file with all sheets from individual files"""
        summary_file = os.path.join(self.output_dir, "summary.xlsx")
        with pd.ExcelWriter(summary_file) as writer:
            for filename in os.listdir(self.output_dir):
                if filename.endswith(".xlsx") and filename != "summary.xlsx":
                    filepath = os.path.join(self.output_dir, filename)
                    excel_file = pd.ExcelFile(filepath)
                    for sheet_name in excel_file.sheet_names:
                        df = pd.read_excel(filepath, sheet_name=sheet_name)
                        df.to_excel(writer, sheet_name=f"{filename[:-5]}_{sheet_name}", index=False) 