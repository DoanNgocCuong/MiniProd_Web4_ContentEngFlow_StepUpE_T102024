import streamlit as st
import pandas as pd
import os

def load_css():
    """Load custom CSS for tables."""
    css_file = os.path.join(os.path.dirname(__file__), "styles", "tables.css")
    with open(css_file) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

def render_exercise():
    st.title("Exercise: Learning Cards")
    
    # Load custom CSS
    load_css()
    
    # Get exercises from session state
    if 'card_exercises' not in st.session_state:
        st.error("No exercise data available. Please generate exercises first.")
        return
        
    exercises = st.session_state.card_exercises

    # Create DataFrame for all exercises
    exercises_data = []
    for idx, exercise in enumerate(exercises):
        exercises_data.append({
            'Description': f"Học từ vựng",
            'Sentence (EN)': exercise["sentence_en"],
            'Sentence (VI)': exercise["sentence_vi"],
            'IPA': exercise["ipa"],
            'Actions': f'<button class="edit-btn">Edit</button> <button class="delete-btn">Delete</button>'
        })
    
    df = pd.DataFrame(exercises_data)

    # Add CSS classes to columns
    html_table = df.to_html(escape=False, index=False)
    html_table = html_table.replace('<th>Description</th>', '<th class="description-col">Description</th>')
    html_table = html_table.replace('<th>Sentence (EN)</th>', '<th class="sentence-col">Sentence (EN)</th>')
    html_table = html_table.replace('<th>Sentence (VI)</th>', '<th class="sentence-col">Sentence (VI)</th>')
    html_table = html_table.replace('<th>IPA</th>', '<th class="ipa-col">IPA</th>')
    html_table = html_table.replace('<th>Actions</th>', '<th class="actions-col">Actions</th>')

    # Display the table
    st.markdown("### All Cards")
    st.write(html_table, unsafe_allow_html=True)

if __name__ == "__main__":
    render_exercise()
