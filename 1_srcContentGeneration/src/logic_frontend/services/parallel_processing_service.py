import concurrent.futures
from typing import List, Dict, Any, Callable
from functools import partial

class ParallelProcessingService:
    def __init__(self, max_workers: int = 20):
        self.max_workers = max_workers

    def process_in_parallel(self, tasks: List[Any], process_func: Callable, *fixed_args) -> List[Any]:
        """Process tasks in parallel using ThreadPoolExecutor"""
        results = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # Create partial function with fixed arguments
            process_task = partial(process_func, *fixed_args)
            # Submit all tasks
            futures = [executor.submit(process_task, *task) for task in tasks]
            # Wait for all tasks to complete and collect results
            for future in concurrent.futures.as_completed(futures):
                try:
                    result = future.result()
                    results.append(result)
                except Exception as e:
                    print(f"Error processing task: {e}")
        return results 