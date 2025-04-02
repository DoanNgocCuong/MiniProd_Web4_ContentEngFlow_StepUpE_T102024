import streamlit as st
import json
import pandas as pd
from .base_generator import BaseGenerator

class LearningPathGenerator(BaseGenerator):
    """Generator for creating personalized learning paths."""
    
    def __init__(self):
        super().__init__("http://103.253.20.13:3000/api/generate-learning-path")
        
    def render(self):
        """Render the learning path generator interface."""
        st.title("🎯 Learning Path Generator")
        st.markdown("Generate your personalized English learning path based on your profile and goals.")

        # User profile input section
        st.header("Your Profile")
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

        # Generate button
        if st.button("Generate Learning Path", type="primary"):
            self.generate(industry=industry, job_role=job_role, 
                         english_level=english_level, learning_goals=learning_goals)

    def generate(self, **kwargs):
        """Generate learning path based on user profile."""
        user_profile = self._format_user_profile(
            kwargs['industry'], kwargs['job_role'],
            kwargs['english_level'], kwargs['learning_goals']
        )
        
        data = self._make_api_request({"userProfile": user_profile})
        if not data:
            return None
            
        learning_path = json.loads(data["learningPath"])
        
        # Display results
        st.success("Learning path generated successfully!")
        
        # Display user profile description
        st.subheader("Profile Summary")
        st.write(learning_path["user_profile_description"])
        
        # Display communication partners
        st.subheader("Communication Partners")
        for partner in learning_path["communication_partners"]:
            with st.expander(f"👥 {partner['group']}"):
                for scenario in partner["scenarios"]:
                    st.write(f"• {scenario}")
        
        # Display learning path
        st.subheader("Learning Path")
        for week in learning_path["learning_path"]:
            with st.expander(f"📅 Week {week['week']}: {week['topic']}"):
                for scenario in week["scenarios"]:
                    st.write(f"• {scenario['scenario']}")
        
        # Display milestones
        st.subheader("🎯 Milestones")
        milestones_df = pd.DataFrame(learning_path["milestones"])
        st.dataframe(milestones_df, use_container_width=True)
        
        # Download button
        self._download_json(learning_path, "learning_path")
        
        return learning_path

def main():
    """Main function to render the learning path generator."""
    generator = LearningPathGenerator()
    generator.render()

if __name__ == "__main__":
    main() 