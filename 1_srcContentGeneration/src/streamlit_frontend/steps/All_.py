import streamlit as st
from .A_FromUserProfileGenLearningPath import LearningPathGenerator
from .B1_From1TopicGen20QuestionChunking import QuestionGenerator

class CombinedGenerator:
    """Combined generator that integrates learning path and question generation."""
    
    def __init__(self):
        self.learning_path_generator = LearningPathGenerator()
        self.question_generator = QuestionGenerator()
        self.current_learning_path = None
        
    def render(self):
        """Render the combined interface."""
        st.title("🎯 English Learning Content Generator")
        
        # Step 1: Generate Learning Path
        st.header("Step 1: Generate Learning Path")
        self.learning_path_generator.render()
        
        # Get the generated learning path
        if hasattr(self.learning_path_generator, 'current_data'):
            self.current_learning_path = self.learning_path_generator.current_data
            
            if self.current_learning_path:
                # Step 2: Display Topics and Generate Questions
                st.header("Step 2: Topics & Questions")
                
                # Display each week's topic with scenarios and generate button
                for week in self.current_learning_path["learning_path"]:
                    with st.expander(f"📅 Week {week['week']}: {week['topic']}", expanded=True):
                        # Create two columns - one for scenarios, one for button
                        col1, col2 = st.columns([3, 1])
                        
                        # Display scenarios in first column
                        with col1:
                            st.write("Scenarios:")
                            for scenario in week["scenarios"]:
                                st.write(f"• {scenario['scenario']}")
                        
                        # Generate button in second column
                        with col2:
                            if st.button("🎯 Generate 20 Questions", 
                                       key=f"gen_btn_{week['week']}", 
                                       type="primary",
                                       use_container_width=True):
                                with st.spinner("Generating questions..."):
                                    # Prepare user profile
                                    user_profile = {
                                        "industry": self.current_learning_path["user_profile_description"],
                                        "job_role": self.current_learning_path["user_profile_description"],
                                        "english_level": self.current_learning_path["user_profile_description"],
                                        "learning_goals": self.current_learning_path["user_profile_description"]
                                    }
                                    
                                    # Generate questions
                                    questions = self.question_generator.generate(
                                        industry=user_profile["industry"],
                                        job_role=user_profile["job_role"],
                                        english_level=user_profile["english_level"],
                                        learning_goals=user_profile["learning_goals"],
                                        topic=week["topic"],
                                        scenarios=week["scenarios"]
                                    )
                                    
                                    if questions:
                                        st.success("Questions generated!")
                                        st.json(questions)

def main():
    """Main function to run the combined generator."""
    generator = CombinedGenerator()
    generator.render()

if __name__ == "__main__":
    main()
