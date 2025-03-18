import openai
import psycopg2
import os
from dotenv import load_dotenv

# Configure OpenAI API (Ensure your API key is set as an environment variable)
openai.api_key = "your_openai_api_key"

def fetch_threats():
    """
    Retrieves threat data from the PostgreSQL database.
    """
    try:
        conn = psycopg2.connect("dbname=threat_intel user=admin password=securepass")
        cursor = conn.cursor()
        cursor.execute("SELECT id, threat_name FROM threats WHERE risk_level IS NULL;")
        threats = cursor.fetchall()
        cursor.close()
        conn.close()
        return threats
    except Exception as e:
        print(f"Database Error: {e}")
        return []

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def test_ai_response():
    prompt = "Analyze threat: 'SQL Injection'. Return JSON with likelihood and impact (1-5)."
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "system", "content": prompt}]
    )

    print("AI Response:", response["choices"][0]["message"]["content"])

def assess_risk_with_gpt(threat_name):
    """
    Uses GPT-4 to assess likelihood and impact of a threat.
    Returns a tuple: (likelihood, impact).
    """
    prompt = f"Assess the risk of the following cybersecurity threat: {threat_name}. \
        Provide a likelihood score (1-5) and impact score (1-5). Format: likelihood=X, impact=Y"
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        
        # Extract likelihood and impact from the response
        gpt_output = response["choices"][0]["message"]["content"]
        likelihood = int(gpt_output.split("likelihood=")[1].split(",")[0].strip())
        impact = int(gpt_output.split("impact=")[1].strip())

        return likelihood, impact
    except Exception as e:
        print(f"GPT-4 Error: {e}")
        return None, None

def update_risk_scores():
    """
    Updates the risk scores in the database based on GPT-4 risk assessment.
    """
    threats = fetch_threats()
    if not threats:
        print("No new threats to assess.")
        return

    try:
        conn = psycopg2.connect("dbname=threat_intel user=admin password=securepass")
        cursor = conn.cursor()

        for threat_id, threat_name in threats:
            likelihood, impact = assess_risk_with_gpt(threat_name)
            
            if likelihood and impact:
                risk_score = likelihood * impact
                cursor.execute(
                    "UPDATE threats SET risk_level = %s WHERE id = %s;",
                    (risk_score, threat_id)
                )
                print(f"Updated threat '{threat_name}' with risk score {risk_score}")

        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Database Update Error: {e}")

if __name__ == "__main__":
    test_ai_response()
    update_risk_scores()




