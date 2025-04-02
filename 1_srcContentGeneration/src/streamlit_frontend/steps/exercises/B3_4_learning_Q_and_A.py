import streamlit as st
import pandas as pd
import os

def load_css():
    """Load custom CSS for tables."""
    css_file = os.path.join(os.path.dirname(__file__), "styles", "tables.css")
    with open(css_file) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

def render_exercise():
    st.title("Exercise: Q&A Learning")
    
    # Load custom CSS
    load_css()
    
    # Get exercises from session state
    if 'qna_exercises' not in st.session_state:
        st.error("No exercise data available. Please generate exercises first.")
        return
        
    exercises = st.session_state.qna_exercises

    # Create DataFrame for all exercises
    exercises_data = []
    for idx, exercise in enumerate(exercises):
        exercises_data.append({
            'Description': exercise["description"],
            'Hidden Sentence': exercise["sentence_hide"],
            'English': exercise["sentence_en"],
            'Actions': f'<button class="edit-btn">Edit</button> <button class="delete-btn">Delete</button>'
        })
    
    df = pd.DataFrame(exercises_data)

    # Add CSS classes to columns
    html_table = df.to_html(escape=False, index=False)
    html_table = html_table.replace('<th>Description</th>', '<th class="description-col">Description</th>')
    html_table = html_table.replace('<th>Hidden Sentence</th>', '<th class="sentence-col">Hidden Sentence</th>')
    html_table = html_table.replace('<th>English</th>', '<th class="sentence-col">English</th>')
    html_table = html_table.replace('<th>Actions</th>', '<th class="actions-col">Actions</th>')

    # Display the table
    st.markdown("### All Q&A Exercises")
    st.write(html_table, unsafe_allow_html=True)

    # Add download button
    if len(exercises_data) > 0:
        st.download_button(
            label="Download Exercises",
            data=pd.DataFrame(exercises_data).to_csv(index=False),
            file_name="qna_exercises.csv",
            mime="text/csv"
        )

if __name__ == "__main__":
    render_exercise()
