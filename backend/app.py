from flask import Flask, request, jsonify  # type: ignore
from flask_cors import CORS  # type: ignore
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

# FRED API setup (for future use)
FRED_API_KEY = os.getenv("FRED_API_KEY")
FRED_SERIES_ID = "MORTGAGE30US"

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "Welcome to the Chatbot Backend!"


# Helper to simulate getting mortgage rate from Gemini
def get_current_mortgage_rate():
    prompt = """
    What is the current average 30-year fixed mortgage rate in the United States as of this week?
    Give an approximate number based on recent trends and note if you're not sure.
    """
    response = model.generate_content(prompt)
    return response.text.strip()


# Build prompt using the current mortgage rate
def build_prompt(user_message, current_rate):
    return f"""
    You are a helpful financial assistant. The current national average mortgage rate is {current_rate}%.

    A user submitted the following question:
    "{user_message}"

    Use the current rate to make this answer relevant and realistic.
    Explain clearly, avoid jargon, and use examples or numbers if helpful.
    """


@app.route("/api/get_response", methods=["POST"])
def get_response():
    user_message = request.json.get("message")
    current_rate = get_current_mortgage_rate()
    prompt = build_prompt(user_message, current_rate)

    response = model.generate_content(prompt)
    return jsonify({"response": response.text.strip()})


if __name__ == "__main__":
    app.run(debug=True)
