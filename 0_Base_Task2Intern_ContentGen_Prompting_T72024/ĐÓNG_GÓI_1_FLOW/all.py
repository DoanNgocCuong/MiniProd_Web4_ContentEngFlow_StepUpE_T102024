import os
import openai
import requests
import json
import pandas as pd
from openpyxl import Workbook
from typing import List, Tuple

# Set up OpenAI client with API key

# api_key = os.getenv("OPENAI_API_KEY")
# if not api_key:
#     raise ValueError("OPENAI_API_KEY is not set in the environment variables")

# client = openai.OpenAI(api_key=api_key)

# Set up OpenAI client with API key
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY is not set in the environment variables")

client = openai.OpenAI(api_key=api_key)

def get_completion(prompt, model="gpt-4", temperature=0):
    messages = [{"role": "user", "content": prompt}]
    response = client.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=temperature,  # this is the degree of randomness of the model's output
    )
    return response.choices[0].message["content"]

# Function to convert text to speech
def text_to_speech(text, voice, speed, output_path):
    url = "http://103.253.20.13:25010/api/text-to-speech"
    headers = {"Content-Type": "application/json"}
    payload = {"text": text, "voice": voice, "speed": speed}
    
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code == 200:
        with open(output_path, 'wb') as f:
            f.write(response.content)
        print(f"File saved to {output_path}")
    else:
        print(f"Error: {response.status_code} - {response.text}")

# Function to generate content for listening exercise
def gen_content_Dang1Listening(given_words: List[str], topic: str) -> str:
    prompt = f"""
    Act as an English Teacher. Your students are A2 English learners (CEFR).

    Task for you: Write a short story, which includes 4 sections, with the content of each section based on given words and the topic.

    Requirement for the task:
    - These four sections must relate to each other and create a complete story that is easy for A2 level.
    - The total length of four sections must not exceed 100 words.
    - Four sections must be equal.
    - Each section must contain at least 2-3 given words.
    - You must use easy-to-understand vocabularies, suitable for A2 level.
    - You must respond with valid JSON format. The response should be a single JSON object with the following structure:
    {{
        "paragraph1": "content of section1",
        "list1": ["word1", "word2", "word3"],
        "paragraph2": "content of section2",
        "list2": ["word4", "word5", "word6"],
        "paragraph3": "content of section3",
        "list3": ["word7", "word8", "word9"],
        "paragraph4": "content of section4",
        "list4": ["word10", "word11", "word12"]
    }}

    The following are given words for each section and the topic:
    Given words: {", ".join(given_words)}
    Topic: {topic}

    Remember to ensure that your response is a valid JSON object.
    """

    response = get_completion(prompt)
    
    try:
        return response
    except json.JSONDecodeError:
        print("Error: The generated response is not valid JSON. Please check the output.")
        return None

# Function to generate content and audio for listening exercise
def gen_content_AND_audio_Dang1Listening(given_words, topic, audio_folder_output):
    if not os.path.exists(audio_folder_output):
        os.makedirs(audio_folder_output)
        print(f"Đã tạo thư mục '{audio_folder_output}'")
    else:
        print(f"Thư mục '{audio_folder_output}' đã tồn tại")

    response = gen_content_Dang1Listening(given_words, topic)
    paragraph_dict = json.loads(response)

    paragraphs = [paragraph_dict.get(f"paragraph{i}") for i in range(1, 5)]
    phrase_lists = [paragraph_dict.get(f"list{i}") for i in range(1, 5)]

    for i, paragraph in enumerate(paragraphs, start=1):
        if paragraph:
            output_path = f"{audio_folder_output}/{i}.mp3"
            text_to_speech(text=paragraph, voice="en-AU-WilliamNeural", speed=1, output_path=output_path)

    return paragraphs, phrase_lists

# Functions to generate exercises
def ex1_DIEN_VAO_CHO_TRONG_Dang1Listening(input_text, terms_list):
    prompt = f"""
    Your task: Create a fill-in-the-blank exercise based on:
    - the given input text: "{input_text}"
    - and terms from the given list: {terms_list}.

    Select 2 single words from 2 terms of the terms in the `terms_list` and replace them with "__" to create a question.
    Create 7 answer choices: including the 2 replaced words and 5 wrong words.

    Return a JSON object with the keys: input_text, selected_term, question, words.
    """

    response = get_completion(prompt)
    try:
        return response
    except json.JSONDecodeError:
        print("Error: The generated response is not valid JSON. Please check the output.")
        return None

def ex2_CHON_DAP_AN_PHU_HOP_Dang1Listening(input_text, terms_list):
    prompt = f"""
    Your task: Create a multiple-choice exercise with 4 options based on the given text: {input_text}
    and a randomly selected term from the provided list: {terms_list}.

    Select one term, extract a sentence containing the term, create a 5W1H question based on the sentence,
    and provide four answer options.

    Return a JSON object with the keys: selected_term, sentence, question, answers_list.
    """

    response = get_completion(prompt)
    try:
        return response
    except json.JSONDecodeError:
        print("Error: The generated response is not valid JSON. Please check the output.")
        return None

def ex3_NOI_DE_TRA_LOI_Dang1Listening(input_text, terms_list):
    prompt = f"""
    Based on the content of provided paragraph, create one question using 5W1H method. Ensure the question is suitable for B1 English learners (CEFR).

    The following is the provided paragraph: {input_text}

    Return a valid JSON object with the structure:
    {{
        "question": "Your question here"
    }}
    """

    response = get_completion(prompt)
    return response

def ex4_DIEN_PHAN_CON_THIEU_Dang1Listening(input_text, terms_list):
    prompt = f"""
    Your task: Create a fill-type exercise based on the given {input_text} text and 1 random term from several terms in the given {terms_list} list.

    Choose 1 term, find its exact form in the input text, create a fill-type question by replacing it with "__",
    and provide the correct answer.

    Return a JSON object with the structure:
    {{
        "selected_term": "selected_term",
        "sentence": "extracted sentence",
        "question": "Your fill-type question here",
        "answers_list": ["correct_form_of_selected_term"]
    }}
    """

    response = get_completion(prompt)
    return response

# Function to generate content and save to Excel
def input_2_gen_content_AND_audio_2_excel(input_file_path: str, output_folder: str) -> Tuple[pd.DataFrame, str]:
    os.makedirs(output_folder, exist_ok=True)
    output_excel_file = f"{output_folder}/output_dang1_LISTENING.xlsx".replace(os.sep, '/')
    df = pd.read_excel(input_file_path, sheet_name="Input bài nghe")

    results = []
    for index, row in df.iterrows():
        row_id = index + 1
        topic = row["Chủ đề"]
        given_words = row["Cụm"].split(", ")

        row_folder = f"{output_folder}/row_{row_id}".replace(os.sep, '/')
        os.makedirs(row_folder, exist_ok=True)

        paragraphs, phrase_lists = gen_content_AND_audio_Dang1Listening(given_words, topic, row_folder)
        audio_paths = [f"{row_folder}/{i}.mp3".replace(os.sep, '/') for i in range(1, 5)]

        results.append({
            'id': row_id,
            'content_part_1': paragraphs[0],
            'content_part_2': paragraphs[1],
            'content_part_3': paragraphs[2],
            'content_part_4': paragraphs[3],
            'audio_part_1': audio_paths[0],
            'audio_part_2': audio_paths[1],
            'audio_part_3': audio_paths[2],
            'audio_part_4': audio_paths[3],
            'vocab_part_1': ', '.join(phrase_lists[0]),
            'vocab_part_2': ', '.join(phrase_lists[1]),
            'vocab_part_3': ', '.join(phrase_lists[2]),
            'vocab_part_4': ', '.join(phrase_lists[3])
        })

    result_df = pd.DataFrame(results)

    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "mix_listen_content"
    sheet.append([
        'id', 'content_part_1', 'content_part_2', 'content_part_3', 'content_part_4',
        'audio_part_1', 'audio_part_2', 'audio_part_3', 'audio_part_4',
        'vocab_part_1', 'vocab_part_2', 'vocab_part_3', 'vocab_part_4'
    ])

    for _, result in result_df.iterrows():
        new_row = [
            result['id'],
            result['content_part_1'],
            result['content_part_2'],
            result['content_part_3'],
            result['content_part_4'],
            result['audio_part_1'],
            result['audio_part_2'],
            result['audio_part_3'],
            result['audio_part_4'],
            result['vocab_part_1'],
            result['vocab_part_2'],
            result['vocab_part_3'],
            result['vocab_part_4']
        ]
        sheet.append(new_row)

    workbook.save(output_excel_file)
    print(f"Details have been written to Excel file '{output_excel_file}'")

    return result_df, output_excel_file

# Function to process the Excel file and generate exercises
def process_excel(file_path, sheet_name, processing_func, content_col, vocab_col):
    df = pd.read_excel(file_path, sheet_name=sheet_name)
    
    data = []
    for index, row in df.iterrows():
        paragraph_text = row[content_col]
        vocab_list = row[vocab_col].split(", ")

        try:
            response_json = processing_func(paragraph_text, vocab_list)
            
            if not response_json:
                print(f"Warning: Processing function returned an empty response for row {index}")
                continue
            
            response_dict = json.loads(response_json)
            
            data.append({
                "question": response_dict["question"],
                "paragraph": paragraph_text,
                "answer": "\n".join([answer.strip() for answer in response_dict.get("answers_list", [])])
            })
        except json.JSONDecodeError as e:
            print(f"JSON decode error for row {index}: {e}")
            continue
        except Exception as e:
            print(f"Error processing row {index}: {e}")
            continue
    
    output_df = pd.DataFrame(data)
    return output_df

# Define the processing functions
def process_paragraph1(paragraph_text, vocab_list):
    return ex1_DIEN_VAO_CHO_TRONG_Dang1Listening(paragraph_text, vocab_list)

def process_paragraph2(paragraph_text, vocab_list):
    return ex2_CHON_DAP_AN_PHU_HOP_Dang1Listening(paragraph_text, vocab_list)

def process_paragraph3(paragraph_text, vocab_list):
    return ex3_NOI_DE_TRA_LOI_Dang1Listening(paragraph_text, vocab_list)

def process_paragraph4(paragraph_text, vocab_list):
    return ex4_DIEN_PHAN_CON_THIEU_Dang1Listening(paragraph_text, vocab_list)

# Paths for input and output files
input_file_path = r"D:\OneDrive - Hanoi University of Science and Technology\ITE10-DS&AI-HUST\Learn&Task\PRODUCT_THECOACH\Task2_ContentGeneration\ĐÓNG_GÓI_1_FLOW\Sản xuất nội dung 01.xlsx"

output_folder = "./out_folder"

# Generate content and audio, save to Excel
result_df, output_file_path = input_2_gen_content_AND_audio_2_excel(input_file_path, output_folder)

# Process each type of paragraph and store in DataFrames
df1 = process_excel(output_file_path, 'mix_listen_content', process_paragraph1, 'content_part_1', 'vocab_part_1')
df2 = process_excel(output_file_path, 'mix_listen_content', process_paragraph2, 'content_part_2', 'vocab_part_2')
df3 = process_excel(output_file_path, 'mix_listen_content', process_paragraph3, 'content_part_3', 'vocab_part_3')
df4 = process_excel(output_file_path, 'mix_listen_content', process_paragraph4, 'content_part_4', 'vocab_part_4')

# Write all DataFrames to a single Excel file with different sheets
combined_output_file_path = 'combined_Dang1Listening_output.xlsx'
with pd.ExcelWriter(combined_output_file_path, engine='xlsxwriter') as writer:
    result_df.to_excel(writer, sheet_name='mix_listen_content', index=False)
    df1.to_excel(writer, sheet_name='Ex1_listen_fill_choose', index=False)
    df2.to_excel(writer, sheet_name='Ex2_listen_choice', index=False)
    df3.to_excel(writer, sheet_name='Ex3_listen_speak', index=False)
    df4.to_excel(writer, sheet_name='Ex4_listen_fill_type', index=False)

print(f"Data has been successfully written to {combined_output_file_path}")
