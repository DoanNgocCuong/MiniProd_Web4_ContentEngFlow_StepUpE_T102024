import streamlit as st
import json
from .base_generator import BaseGenerator

from .exercises.B3_1_learning_meaning import render_exercise as render_meaning_exercise
from .exercises.B3_2_learning_card import render_exercise as render_card_exercise
from .exercises.B3_3_learning_flexible_phrase import render_exercise as render_flexible_exercise
from .exercises.B3_4_learning_Q_and_A import render_exercise as render_qna_exercise

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


        # Add separate button for learning meaning exercise
        if st.button("Generate Learning Meaning Exercise", type="secondary"):
            if not question_details:
                st.error("Please provide question detail JSON.")
                return

            try:
                data = json.loads(question_details)
                st.success("Generating Learning Meaning Exercise...")
                
                # Generate only meaning exercise
                meaning_data = self._make_api_request(
                    {
                        "lessons": [{
                            "structure": data["questions"][0]["structure"],
                            "main phrase": data["questions"][0]["main phrase"],
                            "optional phrase 1": data["questions"][0]["optional phrase 1"],
                            "optional phrase 2": data["questions"][0]["optional phrase 2"],
                            "structure-vi": data["questions"][0]["structure-vi"],
                            "main phrase-vi": data["questions"][0]["main phrase-vi"],
                            "optional phrase 1-vi": data["questions"][0]["optional phrase 1-vi"],
                            "optional phrase 2-vi": data["questions"][0]["optional phrase 2-vi"]
                        }]
                    },
                    endpoint=self.meaning_endpoint
                )
                
                if meaning_data:
                    # Store the meaning exercise data in session state
                    st.session_state.meaning_exercises = meaning_data
                    # Render the interactive meaning exercise
                    render_meaning_exercise()
                    
                    # Download the meaning exercise
                    self._download_json(meaning_data, "meaning_exercise")
                else:
                    st.error("Failed to generate learning meaning exercise.")
                    
            except json.JSONDecodeError:
                st.error("Invalid JSON format. Please check your input.")
            except Exception as e:
                st.error(f"An error occurred: {str(e)}")

        # Add separate button for learning card exercise
        if st.button("Generate Learning Card Exercise", type="secondary"):
            if not question_details:
                st.error("Please provide question detail JSON.")
                return

            try:
                data = json.loads(question_details)
                st.success("Generating Learning Card Exercise...")
                
                # Generate only card exercise
                card_data = self._make_api_request(
                    {
                        "lessons": [{
                            "structure": data["questions"][0]["structure"],
                            "main phrase": data["questions"][0]["main phrase"],
                            "optional phrase 1": data["questions"][0]["optional phrase 1"],
                            "optional phrase 2": data["questions"][0]["optional phrase 2"],
                            "structure-vi": data["questions"][0]["structure-vi"],
                            "main phrase-vi": data["questions"][0]["main phrase-vi"],
                            "optional phrase 1-vi": data["questions"][0]["optional phrase 1-vi"],
                            "optional phrase 2-vi": data["questions"][0]["optional phrase 2-vi"]
                        }]
                    },
                    endpoint=self.card_endpoint
                )
                
                if card_data:
                    # Store the card exercise data in session state
                    st.session_state.card_exercises = card_data
                    # Render the interactive card exercise
                    render_card_exercise()
                    
                    # Download the card exercise
                    self._download_json(card_data, "card_exercise")
                else:
                    st.error("Failed to generate learning card exercise.")
                    
            except json.JSONDecodeError:
                st.error("Invalid JSON format. Please check your input.")
            except Exception as e:
                st.error(f"An error occurred: {str(e)}")

        # Add separate button for flexible phrase exercise
        if st.button("Generate Flexible Phrase Exercise", type="secondary"):
            if not question_details:
                st.error("Please provide question detail JSON.")
                return

            try:
                data = json.loads(question_details)
                st.success("Generating Flexible Phrase Exercise...")
                
                # Generate only flexible exercise
                flexible_data = self._make_api_request(
                    {
                        "lessons": [{
                            "question": data["questions"][0]["question"],
                            "structure": data["questions"][0]["structure"],
                            "phrases": [
                                data["questions"][0]["main phrase"],
                                data["questions"][0]["optional phrase 1"],
                                data["questions"][0]["optional phrase 2"]
                            ]
                        }]
                    },
                    endpoint=self.flexible_endpoint
                )
                
                if flexible_data:
                    # Store the flexible exercise data in session state
                    st.session_state.flexible_exercises = flexible_data
                    # Render the interactive flexible exercise
                    render_flexible_exercise()
                    
                    # Download the flexible exercise
                    self._download_json(flexible_data, "flexible_exercise")
                else:
                    st.error("Failed to generate flexible phrase exercise.")
                    
            except json.JSONDecodeError:
                st.error("Invalid JSON format. Please check your input.")
            except Exception as e:
                st.error(f"An error occurred: {str(e)}")

        # Add separate button for Q&A exercise
        if st.button("Generate Q&A Exercise", type="secondary"):
            if not question_details:
                st.error("Please provide question detail JSON.")
                return

            try:
                data = json.loads(question_details)
                st.success("Generating Q&A Exercise...")
                
                # Generate only Q&A exercise
                qna_data = self._make_api_request(
                    {
                        "lessons": [{
                            "question": data["questions"][0]["question"],
                            "structure": data["questions"][0]["structure"],
                            "main phrase": data["questions"][0]["main phrase"],
                            "optional phrase 1": data["questions"][0]["optional phrase 1"],
                            "optional phrase 2": data["questions"][0]["optional phrase 2"],
                            "question-vi": data["questions"][0]["question-vi"],
                            "structure-vi": data["questions"][0]["structure-vi"],
                            "main phrase-vi": data["questions"][0]["main phrase-vi"],
                            "optional phrase 1-vi": data["questions"][0]["optional phrase 1-vi"],
                            "optional phrase 2-vi": data["questions"][0]["optional phrase 2-vi"]
                        }]
                    },
                    endpoint=self.qna_endpoint
                )
                
                if qna_data:
                    # Store the Q&A exercise data in session state
                    st.session_state.qna_exercises = qna_data
                    # Render the interactive Q&A exercise
                    render_qna_exercise()
                    
                    # Download the Q&A exercise
                    self._download_json(qna_data, "qna_exercise")
                else:
                    st.error("Failed to generate Q&A exercise.")
                    
            except json.JSONDecodeError:
                st.error("Invalid JSON format. Please check your input.")
            except Exception as e:
                st.error(f"An error occurred: {str(e)}")

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
                # Store the QNA exercise data in session state
                st.session_state.qna_exercises = qna_data
                # Render the interactive QNA exercise
                render_qna_exercise()

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
                # Store the meaning exercise data in session state
                st.session_state.meaning_exercises = meaning_data
                # Render the interactive meaning exercise
                render_meaning_exercise()

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
                # Store the flexible exercise data in session state
                st.session_state.flexible_exercises = flexible_data
                # Render the interactive flexible exercise
                render_flexible_exercise()

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
                # Store the card exercise data in session state
                st.session_state.card_exercises = card_data
                # Render the interactive card exercise
                render_card_exercise()

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
