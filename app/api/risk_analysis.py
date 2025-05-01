import openai
import psycopg2
import os
import time
from dotenv import load_dotenv
from plyer import notification
import re

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
DB_CONN = "dbname=threat_intel user=admin password=securepass"

def fetch_threats():
    try:
        conn = psycopg2.connect(DB_CONN)
        cursor = conn.cursor()
        cursor.execute("SELECT id, threat_name FROM threats WHERE risk_level IS NULL;")
        threats = cursor.fetchall()
        cursor.close()
        conn.close()
        return threats
    except Exception as e:
        print(f"Database Error: {e}")
        return []

def assess_risk_with_gpt(threat_name):
    prompt = f"""You are a cybersecurity analyst. Assess the threat '{threat_name}'.\n
    Return:\n    - likelihood (1-5)\n    - impact (1-5)\n    - trend score (1-5)\n    - mitigation recommendation (1-2 sentences)\n
    Format: likelihood=X, impact=Y, trend=Z, mitigation=\"...\ """.strip()

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )

        gpt_output = response["choices"][0]["message"]["content"]

        likelihood = int(re.search(r"likelihood=(\d+)", gpt_output).group(1))
        impact = int(re.search(r"impact=(\d+)", gpt_output).group(1))
        trend = int(re.search(r"trend=(\d+)", gpt_output).group(1))
        mitigation = re.search(r'mitigation=\"([^\"]+)\"', gpt_output).group(1)

        return likelihood, impact, trend, mitigation
    except Exception as e:
        print(f"GPT-4 Error: {e}")
        return None, None, None, None

def update_risk_scores():
    threats = fetch_threats()
    if not threats:
        print("No new threats to assess.")
        return

    try:
        conn = psycopg2.connect(DB_CONN)
        cursor = conn.cursor()

        for threat_id, threat_name in threats:
            likelihood, impact, trend, mitigation = assess_risk_with_gpt(threat_name)
            if likelihood and impact and trend:
                risk_score = likelihood * impact + trend * 2

                cursor.execute(
                    """
                    UPDATE threats SET
                        risk_level = %s,
                        trend_score = %s,
                        mitigation = %s
                    WHERE id = %s;
                    """,
                    (risk_score, trend, mitigation, threat_id)
                )
                print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Updated '{threat_name}' with risk score {risk_score}")
                cursor.execute(
                    """
                    INSERT INTO event_log (asset_id, threat_id, action, details)
                    VALUES (
                        (SELECT asset_id FROM threats WHERE id = %s),
                        %s,
                        'Risk Assessment',
                        %s
                    );
                    """,
                    (threat_id, threat_id, f"Risk level updated to {risk_score}, mitigation: {mitigation}")
                )

                if risk_score >= 8:
                    notification.notify(
                        title=f"🚨 Threat: {threat_name}",
                        message=f"Risk Score: {risk_score}\nMitigation: {mitigation}",
                        timeout=10
                    )

        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Database Update Error: {e}")
    

if __name__ == "__main__":
    while True:
        update_risk_scores()
        print("Sleeping for 10 minutes...\n")
        time.sleep(600)
