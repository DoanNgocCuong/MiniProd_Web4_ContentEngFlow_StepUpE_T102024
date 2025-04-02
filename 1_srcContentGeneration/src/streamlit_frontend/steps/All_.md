# Content Generation Flow

## Overview
This document outlines the logic for the content generation flow in the English learning platform.

## Run A: Learning Path Generation

### Input
User Profile with:
- Industry (e.g., IT)
- Job Role (e.g., CTO)
- English Level (e.g., A2)
- Learning Goals (e.g., workplace communication, job interviews, salary review)

### API Endpoint
```
POST http://103.253.20.13:3000/api/generate-learning-path
```

### Output
Learning Path JSON containing:
1. User profile description
2. Communication partners and their scenarios
3. 10-week learning path with:
   - Topics (English + Vietnamese)
   - 5 scenarios per topic
4. Milestones at:
   - 2h
   - 10h
   - 14h
   - 35h
   - 50h

## Run B.1: Question Generation

### Input
- User Profile (from Run A)
- Topic (from learning path)
- Scenario (from topic)

### API Endpoint
```
POST http://103.253.20.13:3000/api/generate-20-chunking-from-5-scenario
```

### Output
Questions for each scenario including:
1. English questions
2. Vietnamese translations
3. Context-specific questions based on:
   - User's role
   - Industry
   - English level
   - Learning goals

## Flow Diagram
```
User Profile
     ↓
Run A: Generate Learning Path
     ↓
Learning Path JSON
     ↓
For each Topic + Scenario:
     ↓
Run B.1: Generate Questions
     ↓
Questions JSON
```

## Example Flow

1. User enters profile:
   ```
   Industry: IT
   Job: CTO
   English Level: A2
   Learning Goals: workplace communication, job interviews, salary review
   ```

2. System generates learning path with topics like:
   - Week 1: Project updates | Cập nhật dự án
   - Week 2: Technical guidance | Hướng dẫn kỹ thuật
   etc.

3. For each topic + scenario, system generates:
   - Contextual questions
   - Translations
   - Practice materials

===

À đúng rồi, xin lỗi bạn! Tôi hiểu rồi - mỗi topic cần có nút generate riêng bên cạnh nó.

Let me fix that:

```python:1_srcContentGeneration/src/streamlit_frontend/steps/All_.py
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
```
Bây giờ đúng rồi:
1. Mỗi topic được hiển thị trong một expander
2. Bên trong expander chia làm 2 cột:
   - Cột trái (3/4): hiển thị 5 scenarios
   - Cột phải (1/4): nút "🎯 Generate 20 Questions"
3. Khi click nút, sẽ generate questions cho topic đó

Layout sẽ như này:
```
📅 Week 1: Topic 1
├── Scenarios:                    [🎯 Generate 20 Questions]
│   • Scenario 1
│   • Scenario 2
│   • Scenario 3
│   • Scenario 4
│   • Scenario 5

📅 Week 2: Topic 2
├── Scenarios:                    [🎯 Generate 20 Questions]
│   • Scenario 1
...
```

Bây giờ đã đúng ý bạn chưa?
