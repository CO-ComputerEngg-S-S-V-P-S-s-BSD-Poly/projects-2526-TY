from flask import Flask, render_template, request, jsonify
import os
import csv
import re
import random
import pandas as pd
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)

# Load the Sentence Transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Load questions and answers from CSV
def load_qa():
    qa_dict = {}
    all_questions = []  # Store all possible questions for random suggestions
    df = pd.read_csv("questions_answers.csv")

    for _, row in df.iterrows():
        question = row["question"].strip().lower()
        question = re.sub(r"[^\w\s]", "", question)  # Remove punctuation
        answer = row["answer"]
        related = row["related"].split("|") if pd.notna(row["related"]) else []
        
        qa_dict[question] = {"answer": answer, "related": related}
        all_questions.append(question)  # Store normalized questions

    return qa_dict, all_questions

qa_data, all_possible_questions = load_qa()

# Encode all questions for faster comparison
question_embeddings = model.encode(all_possible_questions, convert_to_tensor=True)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.form["message"].strip().lower()
    user_input = re.sub(r"[^\w\s]", "", user_input)  # Normalize input

    # Encode user input using SBERT
    user_embedding = model.encode(user_input, convert_to_tensor=True)

    # Find the most similar question
    similarity_scores = util.pytorch_cos_sim(user_embedding, question_embeddings)[0]
    best_match_idx = similarity_scores.argmax().item()
    best_match_score = similarity_scores[best_match_idx].item()

    if best_match_score > 0.75:  # Set threshold for a good match
        best_match = all_possible_questions[best_match_idx]
        response_data = qa_data[best_match]
    else:
        # If no good match, suggest random questions
        suggested_questions = random.sample(all_possible_questions, 3)
        response_data = {
            "answer": "I'm not sure how to respond to that. 🤔 But you can ask about:",
            "related": suggested_questions
        }

    return jsonify(response_data)

if __name__ == "__main__":
    chatbot_port = int(os.getenv("CHATBOT_PORT", "5000"))
    app.run(host="127.0.0.1", port=chatbot_port, debug=True)
