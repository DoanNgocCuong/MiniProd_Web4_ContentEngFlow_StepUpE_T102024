from typing import Dict, List, Tuple, Any
from langgraph.graph import Graph, StateGraph
from langgraph.prebuilt import ToolExecutor
from langchain_core.messages import HumanMessage, AIMessage
from langchain_openai import ChatOpenAI
import json

class ContentGenerationGraph:
    """LangGraph implementation for content generation flow."""
    
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4", temperature=0)
        self.graph = self._build_graph()
        
    def _build_graph(self) -> Graph:
        """Build the LangGraph workflow."""
        # Create workflow graph
        workflow = StateGraph(StateType=Dict)
        
        # Add nodes for each step
        workflow.add_node("generate_learning_path", self._generate_learning_path)
        workflow.add_node("generate_questions", self._generate_questions)
        workflow.add_node("generate_exercises", self._generate_exercises)
        
        # Define edges and conditions
        workflow.add_edge("generate_learning_path", "generate_questions")
        workflow.add_edge("generate_questions", "generate_exercises")
        
        # Set entry point
        workflow.set_entry_point("generate_learning_path")
        
        # Compile graph
        return workflow.compile()
    
    def _generate_learning_path(self, state: Dict) -> Dict:
        """Generate learning path from user profile."""
        user_profile = state["user_profile"]
        
        # Prepare prompt for learning path generation
        prompt = f"""Generate a personalized learning path for:
        {user_profile}
        
        Return a JSON object with:
        1. User profile description
        2. Communication partners and scenarios
        3. 10-week learning path with topics and scenarios
        4. Milestones at 2h, 10h, 14h, 35h, and 50h
        """
        
        # Get response from LLM
        response = self.llm.invoke([HumanMessage(content=prompt)])
        learning_path = json.loads(response.content)
        
        # Update state
        state["learning_path"] = learning_path
        return state
    
    def _generate_questions(self, state: Dict) -> Dict:
        """Generate questions for each scenario."""
        learning_path = state["learning_path"]
        questions = []
        
        # Generate questions for each topic and scenario
        for week in learning_path["learning_path"]:
            topic = week["topic"]
            for scenario in week["scenarios"]:
                prompt = f"""Generate 4 English questions for:
                Topic: {topic}
                Scenario: {scenario['scenario']}
                User Profile: {state['user_profile']}
                
                Return a JSON array of question objects with:
                - question (English)
                - structure (sentence structure)
                - main phrase
                - optional phrases
                - Vietnamese translations
                """
                
                response = self.llm.invoke([HumanMessage(content=prompt)])
                scenario_questions = json.loads(response.content)
                questions.extend(scenario_questions)
        
        # Update state
        state["questions"] = questions
        return state
    
    def _generate_exercises(self, state: Dict) -> Dict:
        """Generate exercises for each question."""
        questions = state["questions"]
        exercises = []
        
        for question in questions:
            # Generate meaning exercise
            meaning_prompt = f"""Generate a meaning exercise for:
            Question: {question['question']}
            Structure: {question['structure']}
            Main phrase: {question['main phrase']}
            
            Return a JSON object with:
            - sentence (with highlighted correct answer)
            - answer options
            - explanations for incorrect answers
            """
            
            meaning_response = self.llm.invoke([HumanMessage(content=meaning_prompt)])
            meaning_exercise = json.loads(meaning_response.content)
            
            # Generate card exercise
            card_prompt = f"""Generate a card exercise for:
            Question: {question['question']}
            Structure: {question['structure']}
            Main phrase: {question['main phrase']}
            
            Return a JSON object with:
            - English sentence
            - Vietnamese translation
            - IPA pronunciation
            """
            
            card_response = self.llm.invoke([HumanMessage(content=card_prompt)])
            card_exercise = json.loads(card_response.content)
            
            # Generate flexible phrase exercise
            flexible_prompt = f"""Generate a flexible phrase exercise for:
            Question: {question['question']}
            Structure: {question['structure']}
            Main phrase: {question['main phrase']}
            
            Return a JSON object with:
            - Progressive difficulty levels
            - Hidden and shown words
            - Bilingual support
            """
            
            flexible_response = self.llm.invoke([HumanMessage(content=flexible_prompt)])
            flexible_exercise = json.loads(flexible_response.content)
            
            # Generate Q&A exercise
            qna_prompt = f"""Generate a Q&A exercise for:
            Question: {question['question']}
            Structure: {question['structure']}
            Main phrase: {question['main phrase']}
            
            Return a JSON object with:
            - Fill-in-the-blank format
            - Hidden sentence
            - Vietnamese instructions
            """
            
            qna_response = self.llm.invoke([HumanMessage(content=qna_prompt)])
            qna_exercise = json.loads(qna_response.content)
            
            # Combine all exercises
            exercises.append({
                "question": question,
                "meaning_exercise": meaning_exercise,
                "card_exercise": card_exercise,
                "flexible_exercise": flexible_exercise,
                "qna_exercise": qna_exercise
            })
        
        # Update state
        state["exercises"] = exercises
        return state
    
    def run(self, user_profile: str) -> Dict:
        """Run the content generation workflow."""
        # Initialize state
        initial_state = {
            "user_profile": user_profile,
            "learning_path": None,
            "questions": None,
            "exercises": None
        }
        
        # Run the graph
        final_state = self.graph.invoke(initial_state)
        return final_state 