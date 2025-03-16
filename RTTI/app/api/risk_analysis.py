import openai
import psycopg2
import os
from dotenv import load_dotenv

# Load API keys from .env file
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# PostgreSQL connection details
DB_PARAMS = {
    "dbname": "threat_intel",
    "user": "admin",
    "password": "securepass",
    "host": "localhost",
    "port": "5432",
}

# OpenAI API configuration
openai.api_key = OPENAI_API_KEY

# Function to generate risk scores using GPT-4
def get_ai_risk_score(threat_name):
    prompt = f"""
    You are a cybersecurity expert. Analyze the following threat: "{threat_name}".
    Assign:
    - Likelihood (L) from 1 (low) to 5 (high)
    - Impact (I) from 1 (low) to 5 (high)
    
    Return your response as a JSON object like this:
    {{
      "likelihood": 4,
      "impact": 5
    }}
    

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "system", "content": prompt}]
    )

    try:
        risk_data = eval(response["choices"][0]["message"]["content"])  # Convert response to dict
        return risk_data.get("likelihood", 2), risk_data.get("impact", 2)
    except Exception as e:
        print("Error parsing AI response:", e)
        return 2, 2  # Default values

# Function to update database with AI-generated risk scores
def update_risk_scores():
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()

        # Get threats without likelihood/impact scores
        cursor.execute("SELECT id, threat_name FROM threats WHERE likelihood IS NULL OR impact IS NULL")
        threats = cursor.fetchall()

        for threat_id, threat_name in threats:
            likelihood, impact = get_ai_risk_score(threat_name)
            risk_score = likelihood * impact

            # Update the threats table
            cursor.execute("""
                UPDATE threats
                SET likelihood = %s, impact = %s, risk_level = %s
                WHERE id = %s
            """, (likelihood, impact, risk_score, threat_id))

            print(f"Updated Threat {threat_name} → L={likelihood}, I={impact}, Risk={risk_score}")

        conn.commit()
        cursor.close()
        conn.close()

    except Exception as e:
        print(f"Database error: {e}")

# Run the AI-based risk assessment
if __name__ == "__main__":
    update_risk_scores()
