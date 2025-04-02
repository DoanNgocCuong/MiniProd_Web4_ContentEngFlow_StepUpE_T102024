import streamlit as st
import sys
import os

# Set page config must be the first Streamlit command
st.set_page_config(
    page_title="English Learning Platform",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the learning path generator module
from streamlit_frontend.steps.A_FromUserProfileGenLearningPath import main as learning_path_main

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
            "Go to",
            ["Learning Path Generator", "Settings"]
        )

    # Main content area
    if page == "Learning Path Generator":
        learning_path_main()
    elif page == "Settings":
        st.title("Settings")
        st.write("Settings page content will go here")

    # Footer
    st.markdown("---")
    st.markdown("Made with ❤️ for improving your English communication skills")

def main():
    """Main entry point for the application."""
    try:
        initialize_app()
    except Exception as e:
        st.error(f"An error occurred while initializing the app: {str(e)}")

if __name__ == "__main__":
    main() 