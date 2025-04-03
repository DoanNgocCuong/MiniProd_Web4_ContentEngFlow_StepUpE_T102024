import json
import logging
import os
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from typing import Dict, List, Optional
from .models.user_profile import UserProfile
from .api.learning_path_api import LearningPathAPI
from .api.chunking_api import ChunkingAPI
from .api.detail_chunking_api import DetailChunkingAPI
from .api.exercises_api import ExercisesAPI
from .services.excel_service import ExcelService
from .services.parallel_processing_service import ParallelProcessingService
from .services.logging_service import LoggingService
from .services.summary_service import SummaryService

class ContentGenerationFlow:
    def __init__(self, base_url: str = "http://103.253.20.13:3000", max_workers: int = 20):
        self.learning_path_api = LearningPathAPI(base_url)
        self.chunking_api = ChunkingAPI(base_url)
        self.detail_chunking_api = DetailChunkingAPI(base_url)
        self.exercises_api = ExercisesAPI(base_url)
        self.excel_service = ExcelService()
        self.parallel_processor = ParallelProcessingService(max_workers)
        self.logger = LoggingService()

    def process_week_chunking(self, user_profile: UserProfile, week: Dict) -> Dict:
        """Process chunking for a single week"""
        self.logger.log_task_start("Week Chunking", {"week": week["week"]})
        try:
            chunking_data = self.chunking_api.generate_20_chunking(user_profile, week)
            chunking = json.loads(chunking_data["chunkingPhrases"])
            self.excel_service.save_to_excel({"Chunking": chunking}, f"chunking_week_{week['week']}")
            result = {"week": week, "chunking": chunking}
            self.logger.log_task_complete("Week Chunking", {"week": week["week"], "scenarios": len(chunking["scenarios"])})
            return result
        except Exception as e:
            self.logger.log_task_error("Week Chunking", e)
            raise

    def process_detail_chunking(self, user_profile: UserProfile, week: Dict, scenario: Dict, question: str) -> Dict:
        """Process detail chunking for a single question-scenario combination"""
        task_name = f"Detail Chunking - Week {week['week']} - Scenario {scenario['scenario']} - Question {question}"
        self.logger.log_task_start(task_name)
        try:
            detail_data = self.detail_chunking_api.generate_detail_chunking(user_profile, week, {
                "scenario": scenario["scenario"],
                "question": question
            })
            detail = detail_data["questions"][0]
            result = {
                "week": week["week"],
                "scenario": scenario["scenario"],
                "question": question,
                "detail": detail
            }
            self.excel_service.save_to_excel({"Detail": detail}, 
                                           f"detail_week_{result['week']}_scenario_{result['scenario']}_question_{result['question']}")
            self.logger.log_task_complete(task_name)
            return result
        except Exception as e:
            self.logger.log_task_error(task_name, e)
            raise

    def process_exercises(self, detail_data: Dict) -> None:
        """Process exercises for a single detail chunking"""
        task_name = f"Exercises - Week {detail_data['week']} - Scenario {detail_data['scenario']} - Question {detail_data['question']}"
        self.logger.log_task_start(task_name)
        try:
            exercises = self.exercises_api.generate_learning_exercises(detail_data["detail"])
            self.excel_service.save_to_excel(exercises, 
                                           f"exercises_week_{detail_data['week']}_scenario_{detail_data['scenario']}_question_{detail_data['question']}")
            self.logger.log_task_complete(task_name)
        except Exception as e:
            self.logger.log_task_error(task_name, e)
            raise

    def process_user_profile(self, user_profile: UserProfile):
        """Main processing flow"""
        start_time = time.time()
        self.logger.log_step_start("Content Generation Flow")

        # Step A: Generate learning path
        self.logger.log_step_start("Step A: Generate Learning Path")
        learning_path_data = self.learning_path_api.generate_learning_path(user_profile)
        learning_path = json.loads(learning_path_data["learningPath"])
        self.excel_service.save_to_excel({"Learning Path": learning_path}, "learning_path")
        self.logger.log_step_complete("Step A: Generate Learning Path")

        # Step B1: Process weeks in parallel
        self.logger.log_step_start("Step B1: Generate 20 Chunking", len(learning_path["learning_path"]))
        week_tasks = [(week,) for week in learning_path["learning_path"]]
        week_results = self.parallel_processor.process_in_parallel(week_tasks, self.process_week_chunking, user_profile)
        self.logger.log_step_complete("Step B1: Generate 20 Chunking")

        # Process detail chunking and exercises for each week
        for week_result in week_results:
            week = week_result["week"]
            chunking = week_result["chunking"]

            # Prepare tasks for detail chunking
            detail_tasks = []
            for chunking_scenario in chunking["scenarios"]:
                # Find matching scenario in week data
                week_scenario = next(
                    (s for s in week["scenarios"] if s["scenario"] == chunking_scenario["scenario"]),
                    None
                )
                
                if week_scenario is None:
                    self.logger.logger.warning(f"Could not find matching scenario for {chunking_scenario['scenario']}")
                    continue

                # Get 4 scenarios for each question
                scenarios_for_question = week["scenarios"][:4]
                
                for question in chunking_scenario["questions"]:
                    for scenario in scenarios_for_question:
                        detail_tasks.append((week, scenario, question))

            # Step B2: Process detail chunking in parallel
            self.logger.log_step_start(f"Step B2: Generate Detail Chunking - Week {week['week']}", len(detail_tasks))
            detail_results = self.parallel_processor.process_in_parallel(detail_tasks, self.process_detail_chunking, user_profile)
            self.logger.log_step_complete(f"Step B2: Generate Detail Chunking - Week {week['week']}")

            # Step B3: Process exercises in parallel
            self.logger.log_step_start(f"Step B3: Generate Exercises - Week {week['week']}", len(detail_results))
            exercise_tasks = [(detail_data,) for detail_data in detail_results]
            self.parallel_processor.process_in_parallel(exercise_tasks, self.process_exercises)
            self.logger.log_step_complete(f"Step B3: Generate Exercises - Week {week['week']}")

        # Create summary file
        self.logger.log_step_start("Create Summary File")
        self.excel_service.create_summary_file()
        self.logger.log_step_complete("Create Summary File")

        # Log final summary
        total_duration = time.time() - start_time
        summary_data = {
            "Total Weeks Processed": len(week_results),
            "Total Detail Chunking Tasks": sum(len(week_result["chunking"]["scenarios"]) * 4 for week_result in week_results),
            "Total Exercise Tasks": sum(len(week_result["chunking"]["scenarios"]) * 4 for week_result in week_results),
            "Total Processing Time": f"{total_duration:.2f} seconds"
        }
        self.logger.log_summary(summary_data)
        self.logger.log_step_complete("Content Generation Flow", total_duration)

if __name__ == "__main__":
    # Example usage
    user_profile = UserProfile(
        industry="IT",
        job="CTO",
        gender="Male",
        native_language="Vietnamese",
        english_level="A2",
        learning_goals=["workplace communication", "job interviews", "salary review"]
    )
    
    flow = ContentGenerationFlow(max_workers=20)
    flow.process_user_profile(user_profile) 