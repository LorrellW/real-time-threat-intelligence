import psycopg2

# PostgreSQL connection details
DB_PARAMS = {
    "dbname": "threat_intel",
    "user": "admin",
    "password": "securepass",
    "host": "localhost",
    "port": "5432",
}

# Define Likelihood and Impact values based on threat type
THREAT_RISK_MAP = {
    "SQL Injection": (4, 5),
    "Phishing Attack": (5, 3),
    "Exposed Ports": (3, 4),
    "DDoS Attack": (5, 5),
    "Malware Infection": (4, 4),
}

# Function to assign risk scores
def assign_risk_scores():
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()

        # Fetch threats that do not have assigned risk values
        cursor.execute("SELECT id, threat_name FROM threats WHERE likelihood IS NULL OR impact IS NULL")
        threats = cursor.fetchall()

        for threat_id, threat_name in threats:
            likelihood, impact = THREAT_RISK_MAP.get(threat_name, (2, 2))  # Default to (2,2) if unknown
            risk_score = likelihood * impact

            # Update threat with risk assessment values
            cursor.execute("""
                UPDATE threats
                SET likelihood = %s, impact = %s
                WHERE id = %s
            """, (likelihood, impact, threat_id))

            print(f"Updated Threat ID {threat_id}: {threat_name} (L={likelihood}, I={impact}, Risk={risk_score})")

        conn.commit()
        cursor.close()
        conn.close()

    except Exception as e:
        print(f"Database error: {e}")

# Run the risk assessment update
if __name__ == "__main__":
    assign_risk_scores()
