from flask import Flask, request, jsonify
from flask_cors import CORS
import os

try:
    import openai
except ImportError:
    raise ImportError("openai package not installed. Run: pip install openai flask flask-cors")

app = Flask(__name__)
CORS(app)

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    raise RuntimeError('OPENAI_API_KEY not set. Set it in your environment before running the server.')

openai.api_key = OPENAI_API_KEY

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json(force=True)
    message = data.get('message', '')
    if not message:
        return jsonify({'error': 'no message provided'}), 400

    # Use OpenAI Chat completions (gpt-4o-mini or gpt-3.5-turbo)
    response = openai.ChatCompletion.create(
        model='gpt-4o-mini',
        messages=[
            {'role': 'system', 'content': 'You are a friendly financial advisor helping users create a financial freedom plan. Answer in clear, actionable steps.'},
            {'role': 'user', 'content': message}
        ],
        max_tokens=500,
        temperature=0.7,
    )

    text = response.choices[0].message.get('content', '')
    return jsonify({'response': text})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
