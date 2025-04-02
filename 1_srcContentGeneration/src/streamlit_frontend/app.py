import streamlit as st
import sys
import os
from steps.A_FromUserProfileGenLearningPath import main as learning_path_main
from steps.B1_From1TopicGen20QuestionChunking import main as question_main
from steps.B2_From1QuestionGenDetailChunking import main as detail_main
from steps.B3_FromDetailChunkingGen4Exercise import main as exercise_main
from steps.All_ import CombinedGenerator

# Initialize session state for settings
if 'api_url' not in st.session_state:
    st.session_state.api_url = "http://103.253.20.13:3000"

# Set page config must be the first Streamlit command
st.set_page_config(
    page_title="English Learning Platform",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def load_css():
    """Load CSS from external file."""
    css_file = os.path.join(os.path.dirname(__file__), "static", "styles.css")
    with open(css_file) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

def initialize_app():
    """Initialize the Streamlit app with common settings and navigation."""
    # Load custom CSS
    load_css()

    # Sidebar navigation
    with st.sidebar:
        st.title("Navigation")
        page = st.radio(
            "Select a page",
            [
                "Complete Generator",
                "Learning Path Generator",
                "Question Generator",
                "Question Detail Generator",
                "Exercise Generator",
                "Settings"
            ]
        )

    # Main content area
    if page == "Complete Generator":
        generator = CombinedGenerator()
        generator.render()
    elif page == "Learning Path Generator":
        learning_path_main()
    elif page == "Question Generator":
        question_main()
    elif page == "Question Detail Generator":
        detail_main()
    elif page == "Exercise Generator":
        exercise_main()
    elif page == "Settings":
        render_settings()

    # Footer
    st.markdown("---")
    st.markdown("Made with ❤️ for improving your English communication skills")

def render_settings():
    """Render the settings page."""
    st.title("⚙️ Settings")
    st.markdown("Configure application settings here.")
    
    # API Configuration
    st.header("API Configuration")
    api_url = st.text_input(
        "API URL",
        value=st.session_state.api_url,
        help="Enter the base URL for the API"
    )
    
    # Save settings button
    if st.button("Save Settings"):
        st.session_state.api_url = api_url
        st.success("Settings saved successfully!")

def main():
    """Main entry point for the application."""
    try:
        initialize_app()
    except Exception as e:
        st.error(f"An error occurred while initializing the app: {str(e)}")

if __name__ == "__main__":
    main() 