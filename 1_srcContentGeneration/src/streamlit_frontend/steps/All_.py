import streamlit as st
import json
import pandas as pd
from .A_FromUserProfileGenLearningPath import LearningPathGenerator
from .B1_From1TopicGen20QuestionChunking import QuestionGenerator
from .B2_From1QuestionGenDetailChunking import QuestionDetailGenerator
from .B3_FromDetailChunkingGen4Exercise import ExerciseGenerator
from .base_generator import BaseGenerator

class CombinedGenerator(BaseGenerator):
    """Combined generator that uses all generators."""
    
    def __init__(self):
        super().__init__()
        self.learning_path_gen = LearningPathGenerator()
        self.question_gen = QuestionGenerator()
        self.detail_gen = QuestionDetailGenerator()
        self.exercise_gen = ExerciseGenerator()
        
    def render(self):
        """Render the combined generator interface."""
        st.title("🎯 Complete Learning Path Generator")
        st.markdown("Generate your personalized learning path and practice questions in one go.")

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

        # Generate button
        if st.button("Generate Complete Learning Path", type="primary"):
            if not all([industry, job_role, english_level, learning_goals]):
                st.error("Please fill in all profile fields.")
                return

            # Step A: Generate Learning Path
            st.subheader("Step A: Generating Learning Path...")
            learning_path_data = self.learning_path_gen.generate(
                industry=industry, job_role=job_role,
                english_level=english_level, learning_goals=learning_goals
            )
            
            if learning_path_data:
                st.success("Learning path generated successfully!")
                
                # Display user profile description
                st.subheader("Profile Summary")
                st.write(learning_path_data["user_profile_description"])
                
                # Display communication partners
                st.subheader("Communication Partners")
                for partner in learning_path_data["communication_partners"]:
                    with st.expander(f"👥 {partner['group']}"):
                        for scenario in partner["scenarios"]:
                            st.write(f"• {scenario}")
                
                # Display learning path
                st.subheader("Learning Path")
                for week in learning_path_data["learning_path"]:
                    with st.expander(f"📅 Week {week['week']}: {week['topic']}"):
                        for scenario in week["scenarios"]:
                            st.write(f"• {scenario['scenario']}")
                
                # Display milestones
                st.subheader("🎯 Milestones")
                milestones_df = pd.DataFrame(learning_path_data["milestones"])
                st.dataframe(milestones_df, use_container_width=True)

                # Step B: Generate Questions for each week
                st.subheader("Step B: Generating Practice Questions...")
                for week in learning_path_data["learning_path"]:
                    with st.expander(f"❓ Questions for Week {week['week']}: {week['topic']}"):
                        questions_data = self.question_gen.generate(
                            industry=industry, job_role=job_role,
                            english_level=english_level, learning_goals=learning_goals,
                            topic=week["topic"], scenarios=week["scenarios"]
                        )
                        
                        if questions_data:
                            st.write(f"**Topic:** {questions_data['topic']}")
                            for scenario in questions_data["scenarios"]:
                                st.write(f"\n**Scenario:** {scenario['scenario']}")
                                for i, question in enumerate(scenario["questions"], 1):
                                    st.write(f"{i}. {question}")

                                # Step C: Generate Detail for each question
                                st.write("\n**Question Details:**")
                                for i, question in enumerate(scenario["questions"], 1):
                                    with st.expander(f"📝 Detail for Question {i}"):
                                        detail_data = self.detail_gen.generate(
                                            industry=industry, job_role=job_role,
                                            english_level=english_level, learning_goals=learning_goals,
                                            topic=week["topic"], scenario=scenario["scenario"],
                                            question=question
                                        )
                                        if detail_data:
                                            st.write("**Grammar Analysis:**")
                                            st.write(detail_data["grammar_point"])
                                            st.write("\n**Vocabulary:**")
                                            for word, meaning in detail_data["vocabulary"].items():
                                                st.write(f"- {word}: {meaning}")
                                            st.write("\n**Practice Tips:**")
                                            for tip in detail_data["practice_tips"]:
                                                st.write(f"• {tip}")

                # Step D: Generate Exercises
                st.header("Step D: Exercise Generation")
                for week in learning_path_data["learning_path"]:
                    with st.expander(f"🎮 Exercises for Week {week['week']}: {week['topic']}"):
                        questions_data = self.question_gen.generate(
                            industry=industry, job_role=job_role,
                            english_level=english_level, learning_goals=learning_goals,
                            topic=week["topic"], scenarios=week["scenarios"]
                        )
                        
                        if questions_data:
                            for scenario in questions_data["scenarios"]:
                                st.write(f"\n**Scenario:** {scenario['scenario']}")
                                for i, question in enumerate(scenario["questions"], 1):
                                    with st.expander(f"📝 Exercises for Question {i}"):
                                        detail_data = self.detail_gen.generate(
                                            industry=industry, job_role=job_role,
                                            english_level=english_level, learning_goals=learning_goals,
                                            topic=week["topic"], scenario=scenario["scenario"],
                                            question=question
                                        )
                                        if detail_data:
                                            self.exercise_gen.generate(detail_data)

                # Download complete learning path
                self.learning_path_gen._download_json(
                    learning_path_data,
                    "complete_learning_path"
                )

def main():
    """Main function to render the combined generator."""
    generator = CombinedGenerator()
    generator.render()

if __name__ == "__main__":
    main() 