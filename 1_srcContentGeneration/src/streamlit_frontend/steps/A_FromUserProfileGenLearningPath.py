import streamlit as st
import requests
import json
import pandas as pd
from datetime import datetime

def render_learning_path_generator():
    """Render the learning path generator interface."""
    # Title and description
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
        # Prepare user profile data
        user_profile = f"industry: [{industry}]\njob: [{job_role}]\nenglishLevel: [{english_level}]\nlearningGoals: [{learning_goals}]"
        
        # API request
        try:
            response = requests.post(
                "http://103.253.20.13:3000/api/generate-learning-path",
                json={"userProfile": user_profile}
            )
            response.raise_for_status()
            data = response.json()
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
            
            # Download button for the learning path
            st.download_button(
                label="Download Learning Path",
                data=json.dumps(learning_path, indent=2),
                file_name=f"learning_path_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
                mime="application/json"
            )
            
        except requests.exceptions.RequestException as e:
            st.error(f"Error generating learning path: {str(e)}")
        except json.JSONDecodeError as e:
            st.error(f"Error parsing response: {str(e)}")
        except Exception as e:
            st.error(f"An unexpected error occurred: {str(e)}")

def main():
    """Main function to render the learning path generator."""
    render_learning_path_generator()

if __name__ == "__main__":
    main() 