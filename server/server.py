import os
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai

# A functional Flask server for the OpenExpress app.
app = Flask(__name__)

# Middleware
# Enable Cross-Origin Resource Sharing (CORS)
CORS(app)

# Initialize Gemini AI client
API_KEY = os.environ.get('API_KEY')
if not API_KEY:
    print("Warning: API_KEY environment variable not set. AI features will not work.")
ai_client = genai.Client(api_key=API_KEY) if API_KEY else None

# Routes
@app.route('/')
def index():
  """Root endpoint to check if the server is running."""
  return jsonify(message='OpenExpress Python server is running!')

@app.route('/api/save-design', methods=['POST'])
def save_design():
  """Endpoint to receive and process design data from the frontend."""
  try:
    print('Received design data to save:', request.json)

    # Check for JWT secret in environment
    jwt_secret = os.environ.get('JWT_SECRET')
    if not jwt_secret:
      return jsonify(error='Server configuration error: JWT_SECRET not set.'), 500

    # Example of how you might use a JWT secret in a real app
    auth_token = request.headers.get('Authorization')
    if not auth_token or not auth_token.startswith('Bearer '):
      return jsonify(error='Authorization token is required.'), 401

    # In a real app, you would validate the JWT token here using jwt_secret
    # For demo purposes, we'll just check if token exists
    token = auth_token.replace('Bearer ', '')
    if not token:
      return jsonify(error='Invalid authorization token.'), 401

    if not request.json or 'title' not in request.json:
      return jsonify(error='Design title is required.'), 400

    # In a real app, you would save this data to a database.
    return jsonify(
      message='Design saved successfully!',
      designId=f'dsn_{int(time.time())}',
      dataReceived=request.json
    ), 201

  except Exception as e:
    print(f"Error in save_design: {e}")
    return jsonify(error='Internal server error.'), 500

@app.route('/api/ai-suggestions', methods=['POST'])
def ai_suggestions():
  """Endpoint to get AI design suggestions."""
  try:
    if not ai_client:
      return jsonify(error='AI service not configured. Please set API_KEY environment variable.'), 503

    if not request.json or 'prompt' not in request.json:
      return jsonify(error='Prompt is required.'), 400

    prompt = request.json['prompt']

    # Basic input validation
    if not isinstance(prompt, str) or len(prompt.strip()) == 0:
      return jsonify(error='Prompt must be a non-empty string.'), 400

    if len(prompt) > 1000:  # Reasonable limit
      return jsonify(error='Prompt is too long. Maximum 1000 characters allowed.'), 400

    full_prompt = f"""
      You are an expert UI/UX and graphic designer.
      A user is asking for design suggestions for the following concept: "{prompt}".

      Please provide 3 distinct and creative design ideas. For each idea, suggest:
      1.  A concept or theme.
      2.  A color palette (with hex codes).
      3.  Font pairings (one for headings, one for body).
      4.  A brief layout description.

      Format your response clearly.
    """

    response = ai_client.models.generate_content(
      model='gemini-2.5-flash',
      contents=full_prompt
    )

    return jsonify(suggestions=response.text), 200

  except Exception as e:
    print(f"Error calling Gemini API: {e}")
    return jsonify(error='Failed to fetch AI suggestions. Please try again later.'), 500

# Start the server
if __name__ == '__main__':
  # Get port from environment variable or default to 8080
  port = int(os.environ.get('PORT', 8080))
  app.run(host='0.0.0.0', port=port, debug=True)
