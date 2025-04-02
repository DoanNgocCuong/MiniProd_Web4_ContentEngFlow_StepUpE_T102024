import streamlit as st
import json
import requests
from .base_generator import BaseGenerator
from .data_example import (
    example_data,
    qna_exercise_example,
    meaning_exercise_example,
    flexible_exercise_example,
    card_exercise_example
)

class ExerciseGenerator(BaseGenerator):
    """Generator for creating 4 types of exercises from question details."""
    
    def __init__(self):
        super().__init__("http://103.253.20.13:3000")
        self.qna_endpoint = f"{self.api_endpoint}/api/generate-learning-qna"
        self.meaning_endpoint = f"{self.api_endpoint}/api/generate-learning-meaning"
        self.flexible_endpoint = f"{self.api_endpoint}/api/generate-learning-flexible"
        self.card_endpoint = f"{self.api_endpoint}/api/generate-learning-card"

    def render(self):
        """Render the exercise generator interface."""
        st.title("🎮 Exercise Generator")
        st.markdown("Generate four types of exercises from question details.")

        # Input section
        st.header("Question Detail")
        
        # Format example data with proper Vietnamese characters
        formatted_example = {
            "questions": [
                {
                    "question": "Can you explain the main objective of the new project?",
                    "structure": "The main objective of the new project is ____.",
                    "main phrase": "to improve efficiency",
                    "optional phrase 1": "to increase revenue",
                    "optional phrase 2": "to enhance customer satisfaction",
                    "question-vi": "Bạn có thể giải thích mục tiêu chính của dự án mới không?",
                    "structure-vi": "Mục tiêu chính của dự án mới là ____.",
                    "main phrase-vi": "cải thiện hiệu quả",
                    "optional phrase 1-vi": "tăng doanh thu",
                    "optional phrase 2-vi": "nâng cao sự hài lòng của khách hàng"
                }
            ],
            "total": 1,
            "requestedCount": 1
        }

        question_details = st.text_area(
            "Enter question details (JSON format)",
            value=json.dumps(formatted_example, indent=2, ensure_ascii=False),
            height=300,
            help="Enter the question details in JSON format"
        )

        # Example buttons
        st.subheader("Example Inputs")
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            if st.button("QNA Example"):
                st.text_area("", value=json.dumps(qna_exercise_example, indent=2, ensure_ascii=False), height=300)
        
        with col2:
            if st.button("Meaning Example"):
                st.text_area("", value=json.dumps(meaning_exercise_example, indent=2, ensure_ascii=False), height=300)
        
        with col3:
            if st.button("Flexible Example"):
                st.text_area("", value=json.dumps(flexible_exercise_example, indent=2, ensure_ascii=False), height=300)
        
        with col4:
            if st.button("Card Example"):
                st.text_area("", value=json.dumps(card_exercise_example, indent=2, ensure_ascii=False), height=300)

        # Generate button
        if st.button("Generate Exercises", type="primary"):
            if not question_details:
                st.error("Please provide question detail JSON.")
                return

            try:
                data = json.loads(question_details)
                self.generate(data)
            except json.JSONDecodeError:
                st.error("Invalid JSON format. Please check your input.")
            except Exception as e:
                st.error(f"An error occurred: {str(e)}")

    def generate(self, detail):
        """Generate all types of exercises from question detail."""
        st.success("Generating exercises...")

        # 1. QNA Exercise
        st.subheader("1️⃣ Question & Answer Exercise")
        with st.expander("Show Exercise"):
            qna_data = self._make_api_request(
                {
                    "lessons": [{
                        "structure": detail["structure"],
                        "main phrase": detail["main phrase"],
                        "optional phrase 1": detail["optional phrase 1"],
                        "optional phrase 2": detail["optional phrase 2"]
                    }]
                },
                endpoint=self.qna_endpoint
            )
            if qna_data:
                for exercise in qna_data:
                    st.write("**Description:**", exercise["description"])
                    st.write("**English Sentence:**", exercise["sentence_en"])
                    st.write("**Hidden Sentence:**", exercise["sentence_hide"])
                    st.write("---")

        # 2. Meaning Exercise
        st.subheader("2️⃣ Meaning Exercise")
        with st.expander("Show Exercise"):
            meaning_data = self._make_api_request(
                {
                    "lessons": [{
                        "structure": detail["structure"],
                        "main phrase": detail["main phrase"],
                        "optional phrase 1": detail["optional phrase 1"],
                        "optional phrase 2": detail["optional phrase 2"],
                        "structure-vi": detail["structure-vi"],
                        "main phrase-vi": detail["main phrase-vi"],
                        "optional phrase 1-vi": detail["optional phrase 1-vi"],
                        "optional phrase 2-vi": detail["optional phrase 2-vi"]
                    }]
                },
                endpoint=self.meaning_endpoint
            )
            if meaning_data:
                for exercise in meaning_data:
                    st.write("**Answer 1:**", exercise["answer_1"])
                    st.write("**Sentence:**", exercise["sentence"])
                    st.write("**Alternative 1:**", exercise["answer_2"])
                    st.write("**Alternative 2:**", exercise["answer_3"])
                    st.write("**Alternative 1 Description:**", exercise["answer_2_description"])
                    st.write("**Alternative 2 Description:**", exercise["answer_3_description"])
                    st.write("---")

        # 3. Flexible Exercise
        st.subheader("3️⃣ Flexible Exercise")
        with st.expander("Show Exercise"):
            flexible_data = self._make_api_request(
                {
                    "lessons": [{
                        "question": detail["question"],
                        "structure": detail["structure"],
                        "phrases": [
                            detail["main phrase"],
                            detail["optional phrase 1"],
                            detail["optional phrase 2"]
                        ]
                    }]
                },
                endpoint=self.flexible_endpoint
            )
            if flexible_data:
                for exercise in flexible_data:
                    st.write("**Description:**", exercise["description"])
                    st.write("**Hidden Sentence:**", exercise["sentence_hide"])
                    st.write("**English Sentence:**", exercise["sentence_en"])
                    st.write("**Vietnamese Sentence:**", exercise["sentence_vi"])
                    st.write("---")

        # 4. Card Exercise
        st.subheader("4️⃣ Card Exercise")
        with st.expander("Show Exercise"):
            card_data = self._make_api_request(
                {
                    "lessons": [{
                        "structure": detail["structure"],
                        "main phrase": detail["main phrase"],
                        "optional phrase 1": detail["optional phrase 1"],
                        "optional phrase 2": detail["optional phrase 2"],
                        "structure-vi": detail["structure-vi"],
                        "main phrase-vi": detail["main phrase-vi"],
                        "optional phrase 1-vi": detail["optional phrase 1-vi"],
                        "optional phrase 2-vi": detail["optional phrase 2-vi"]
                    }]
                },
                endpoint=self.card_endpoint
            )
            if card_data:
                for exercise in card_data:
                    st.write("**English Sentence:**", exercise["sentence_en"])
                    st.write("**Vietnamese Sentence:**", exercise["sentence_vi"])
                    st.write("**IPA:**", exercise["ipa"])
                    st.write("---")

        # Download all exercises
        all_exercises = {
            "qna": qna_data,
            "meaning": meaning_data,
            "flexible": flexible_data,
            "card": card_data
        }
        self._download_json(all_exercises, "all_exercises")

    def _make_api_request(self, payload, endpoint):
        """Make API request with custom endpoint."""
        old_endpoint = self.api_endpoint
        self.api_endpoint = endpoint
        result = super()._make_api_request(payload)
        self.api_endpoint = old_endpoint
        return result

def main():
    """Main function to render the exercise generator."""
    generator = ExerciseGenerator()
    generator.render()

if __name__ == "__main__":
    main()
