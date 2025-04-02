import streamlit as st
import json
from .base_generator import BaseGenerator

class QuestionDetailGenerator(BaseGenerator):
    """Generator for creating detailed question content with answers and translations."""
    
    def __init__(self):
        super().__init__("http://103.253.20.13:3000/api/generate-questions")
        
    def render(self):
        """Render the question detail generator interface."""
        st.title("📝 Question Detail Generator")
        st.markdown("Generate detailed content for a specific question, including answers and translations.")

        # User Profile section
        st.header("Step 1: Your Profile")
        col1, col2 = st.columns(2)

        with col1:
            industry = st.selectbox(
                "Industry",
                ["IT", "Finance", "Healthcare", "Education", "Manufacturing", "Other"]
            )
            job_role = st.selectbox(
                "Job Role",
                ["CTO", "CEO", "Manager", "Developer", "Designer", "Other"]
            )

        with col2:
            english_level = st.selectbox(
                "English Level",
                ["A1", "A2", "B1", "B2", "C1", "C2"]
            )
            learning_goals = st.text_area(
                "Learning Goals",
                placeholder="Enter your specific learning goals..."
            )

        # Topic and Scenario section
        st.header("Step 2: Topic and Scenario")
        topic = st.text_input(
            "Topic",
            placeholder="e.g., Project updates (Cập nhật dự án)",
            value="Project updates (Cập nhật dự án)"
        )
        
        scenario = st.text_area(
            "Scenario",
            placeholder="Enter the specific scenario...",
            height=100
        )

        # Question section
        st.header("Step 3: Question")
        question = st.text_area(
            "Question",
            placeholder="Enter the specific question you want to generate details for...",
            height=100
        )

        # Generate button
        if st.button("Generate Question Detail", type="primary"):
            if not all([industry, job_role, english_level, learning_goals, topic, scenario, question]):
                st.error("Please fill in all fields.")
                return

            self.generate(
                industry=industry, job_role=job_role,
                english_level=english_level, learning_goals=learning_goals,
                topic=topic, scenario=scenario, question=question
            )

    def generate(self, **kwargs):
        """Generate detailed content for a specific question."""
        # Prepare user profile
        user_profile = f"""USER PROFILE:
- Industry: [{kwargs['industry']}]
- Job: [{kwargs['job_role']}]
- English Level: [{kwargs['english_level']}]
- Learning Goals: [{kwargs['learning_goals']}]"""

        # Prepare question data
        question_data = {
            "topic": kwargs['topic'],
            "scenario": kwargs['scenario'],
            "question": kwargs['question']
        }

        # Make API request
        data = self._make_api_request({
            "generateQuestionInput": f"Generate 1 English question about {kwargs['topic']} in the context of {kwargs['scenario']} for {kwargs['job_role']} in {kwargs['industry']} industry. Question MUST BE: {kwargs['question']}"
        })
        if not data or not data.get("questions"):
            st.error("Failed to generate question detail.")
            return None
            
        question_detail = data["questions"][0]  # Get the first question
        
        # Display results
        st.success("Question detail generated successfully!")
        
        # Display English content
        st.subheader("🇬🇧 English Content")
        st.write(f"**Question:** {question_detail['question']}")
        st.write(f"**Structure:** {question_detail['structure']}")
        
        st.write(f"**Main Phrase:** {question_detail['main phrase']}")
        st.write(f"**Option 1:** {question_detail['optional phrase 1']}")
        st.write(f"**Option 2:** {question_detail['optional phrase 2']}")
        
        st.write(f"**Câu hỏi:** {question_detail['question-vi']}")
        st.write(f"**Cấu trúc:** {question_detail['structure-vi']}")
        
        st.write(f"**Cụm từ chính:** {question_detail['main phrase-vi']}")
        st.write(f"**Phương án 1:** {question_detail['optional phrase 1-vi']}")
        st.write(f"**Phương án 2:** {question_detail['optional phrase 2-vi']}")
        
        # Download button
        self._download_json(question_detail, "question_detail")
        return question_detail

def main():
    """Main function to render the question detail generator."""
    generator = QuestionDetailGenerator()
    generator.render()

if __name__ == "__main__":
    main()
