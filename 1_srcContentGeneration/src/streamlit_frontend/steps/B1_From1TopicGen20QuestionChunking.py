import streamlit as st
import json
from .base_generator import BaseGenerator

class QuestionGenerator(BaseGenerator):
    """Generator for creating practice questions from topics and scenarios."""
    
    def __init__(self):
        super().__init__("http://103.253.20.13:3000/api/generate-20-chunking-from-5-scenario")
        
    def render(self):
        """Render the question generator interface."""
        st.title("❓ Question Generator")
        st.markdown("Generate practice questions for your learning scenarios.")

        # User Profile section
        st.header("User Profile")
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

        # Topic and scenarios input section
        st.header("Topic Details")
        
        # Topic input
        topic = st.text_input(
            "Topic",
            placeholder="e.g., Project updates (Cập nhật dự án)",
            value="Project updates (Cập nhật dự án)"
        )

        # Scenarios input
        st.subheader("Scenarios")
        scenarios = []
        for i in range(5):
            scenario = st.text_input(
                f"Scenario {i+1}",
                placeholder=f"Enter scenario {i+1}",
                key=f"scenario_{i}"
            )
            if scenario:
                scenarios.append({"scenario": scenario})

        # Generate button
        if st.button("Generate Questions", type="primary"):
            if not topic or not scenarios:
                st.error("Please enter both topic and scenarios.")
                return

            self.generate(
                industry=industry, job_role=job_role,
                english_level=english_level, learning_goals=learning_goals,
                topic=topic, scenarios=scenarios
            )

    def generate(self, **kwargs):
        """Generate questions based on topic and scenarios."""
        # Prepare user profile
        user_profile = f"""USER PROFILE:
- Industry: [{kwargs['industry']}]
- Job: [{kwargs['job_role']}]
- English Level: [{kwargs['english_level']}]
- Learning Goals: [{kwargs['learning_goals']}]"""

        # Prepare week data
        week_data = {
            "week": 1,
            "topic": kwargs['topic'],
            "scenarios": kwargs['scenarios']
        }

        # Make API request
        data = self._make_api_request({
            "userProfile5Scenario": f"{user_profile}\n---\n{json.dumps(week_data, indent=2)}"
        })
        if not data:
            return None
            
        chunking_data = json.loads(data["chunkingPhrases"])
        
        # Display results
        st.success("Questions generated successfully!")
        
        # Display topic
        st.subheader(f"📝 Topic: {chunking_data['topic']}")
        
        # Display scenarios with questions
        for scenario in chunking_data["scenarios"]:
            with st.expander(f"🎯 {scenario['scenario']}"):
                for i, question in enumerate(scenario["questions"], 1):
                    st.write(f"{i}. {question}")
        
        # Download button
        self._download_json(chunking_data, "questions")
        
        return chunking_data

def main():
    """Main function to render the question generator."""
    generator = QuestionGenerator()
    generator.render()

if __name__ == "__main__":
    main()
