import logging
import time
from datetime import datetime
from typing import Dict, Any
import os

class LoggingService:
    def __init__(self, log_dir: str = "logs"):
        self.log_dir = log_dir
        os.makedirs(self.log_dir, exist_ok=True)
        
        # Setup logging
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        log_file = os.path.join(self.log_dir, f"content_generation_{timestamp}.log")
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler()
            ]
        )
        
        self.logger = logging.getLogger(__name__)
        self.start_time = time.time()
        self.total_tasks = 0
        self.completed_tasks = 0

    def log_step_start(self, step_name: str, total_tasks: int = 0):
        """Log the start of a processing step"""
        self.total_tasks = total_tasks
        self.completed_tasks = 0
        self.logger.info(f"Starting {step_name}")
        if total_tasks > 0:
            self.logger.info(f"Total tasks to process: {total_tasks}")

    def log_task_start(self, task_name: str, task_details: Dict[str, Any] = None):
        """Log the start of a task"""
        details = f" - {task_details}" if task_details else ""
        self.logger.info(f"Starting task: {task_name}{details}")

    def log_task_complete(self, task_name: str, result: Dict[str, Any] = None):
        """Log the completion of a task"""
        self.completed_tasks += 1
        progress = f" ({self.completed_tasks}/{self.total_tasks})" if self.total_tasks > 0 else ""
        result_info = f" - Result: {result}" if result else ""
        self.logger.info(f"Completed task: {task_name}{progress}{result_info}")

    def log_task_error(self, task_name: str, error: Exception):
        """Log an error during task execution"""
        self.logger.error(f"Error in task {task_name}: {str(error)}")

    def log_step_complete(self, step_name: str, duration: float = None):
        """Log the completion of a processing step"""
        if duration is None:
            duration = time.time() - self.start_time
        self.logger.info(f"Completed {step_name} in {duration:.2f} seconds")

    def log_progress(self, current: int, total: int, message: str = ""):
        """Log progress of a long-running operation"""
        progress = (current / total) * 100
        self.logger.info(f"Progress: {progress:.1f}% ({current}/{total}) {message}")

    def log_summary(self, summary_data: Dict[str, Any]):
        """Log a summary of the processing"""
        self.logger.info("Processing Summary:")
        for key, value in summary_data.items():
            self.logger.info(f"{key}: {value}") 