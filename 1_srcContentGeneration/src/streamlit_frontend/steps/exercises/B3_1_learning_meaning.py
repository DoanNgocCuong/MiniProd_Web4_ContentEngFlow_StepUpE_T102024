import streamlit as st
import pandas as pd
import os

def load_css():
    """Load custom CSS for tables."""
    css_file = os.path.join(os.path.dirname(__file__), "styles", "tables.css")
    with open(css_file) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

def render_exercise():

    # Load custom CSS
    load_css()
    
    # Get exercises from session state
    if 'meaning_exercises' not in st.session_state:
        st.error("No exercise data available. Please generate exercises first.")
        return
        
    exercises = st.session_state.meaning_exercises

    # Initialize session state for tracking progress
    if 'current_exercise' not in st.session_state:
        st.session_state.current_exercise = 0
    if 'score' not in st.session_state:
        st.session_state.score = 0

    # Create DataFrame for all exercises
    exercises_data = []
    for idx, exercise in enumerate(exercises):
        exercises_data.append({
            'Description': f"Hãy dịch cụm từ đậm",
            'Sentence (EN)': exercise["sentence"],
            'Answer 1': exercise["answer_1"],
            'Answer 2': exercise["answer_2"],
            'Answer 3': exercise["answer_3"],
            'Answer 2 Description': exercise["answer_2_description"],
            'Answer 3 Description': exercise["answer_3_description"],
            'Actions': f'<button class="edit-btn">Edit</button> <button class="delete-btn">Delete</button>'
        })
    
    df = pd.DataFrame(exercises_data)

    # Add CSS classes to columns
    html_table = df.to_html(escape=False, index=False)
    html_table = html_table.replace('<th>Description</th>', '<th class="description-col">Description</th>')
    html_table = html_table.replace('<th>Sentence (EN)</th>', '<th class="sentence-col">Sentence (EN)</th>')
    html_table = html_table.replace('<th>Answer 1</th>', '<th class="answer-col">Answer 1</th>')
    html_table = html_table.replace('<th>Answer 2</th>', '<th class="answer-col">Answer 2</th>')
    html_table = html_table.replace('<th>Answer 3</th>', '<th class="answer-col">Answer 3</th>')
    html_table = html_table.replace('<th>Answer 2 Description</th>', '<th class="description-answer-col">Answer 2 Description</th>')
    html_table = html_table.replace('<th>Answer 3 Description</th>', '<th class="description-answer-col">Answer 3 Description</th>')
    html_table = html_table.replace('<th>Actions</th>', '<th class="actions-col">Actions</th>')

    # Display the table
    st.markdown("### All Exercises")
    st.write(html_table, unsafe_allow_html=True)


if __name__ == "__main__":
    render_exercise()
