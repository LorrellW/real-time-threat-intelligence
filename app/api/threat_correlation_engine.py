import psycopg2
from datetime import datetime, timedelta

# Database connection
conn = psycopg2.connect(
    dbname="threat_intel",
    user="admin",
    password="securepass",
    host="localhost",
    port=5432
)
cur = conn.cursor()

# Configuration
CORRELATION_WINDOW_MINUTES = 15
CORRELATION_SCORE_WEIGHTS = {
    "same_asset": 40,
    "same_threat_name": 30,
    "time_proximity": 30,
}

def fetch_recent_threats():
    cur.execute("""
        SELECT id, asset_id, threat_name, risk_level, created_at
        FROM threats
        WHERE created_at > NOW() - INTERVAL '1 HOUR'
    """)
    return cur.fetchall()

def correlate_threats(threats):
    correlated = []
    used = set()

    for i in range(len(threats)):
        if threats[i][0] in used:
            continue
        group = [threats[i]]
        for j in range(i + 1, len(threats)):
            if threats[j][0] in used:
                continue

            score = 0
            if threats[i][1] == threats[j][1]:
                score += CORRELATION_SCORE_WEIGHTS["same_asset"]
            if threats[i][2] == threats[j][2]:
                score += CORRELATION_SCORE_WEIGHTS["same_threat_name"]

            delta = abs((threats[i][4] - threats[j][4]).total_seconds())
            if delta <= CORRELATION_WINDOW_MINUTES * 60:
                score += CORRELATION_SCORE_WEIGHTS["time_proximity"]

            if score >= 60:  # Minimum threshold to count as correlated
                group.append(threats[j])
                used.add(threats[j][0])

        if len(group) > 1:
            threat_ids = [t[0] for t in group]
            asset_id = group[0][1]
            correlated.append((asset_id, threat_ids, score))

            for t in group:
                used.add(t[0])

    return correlated

def store_correlations(correlations):
    for asset_id, threat_ids, score in correlations:
        cur.execute("""
            INSERT INTO threat_events (asset_id, threat_ids, correlation_score, detection_notes)
            VALUES (%s, %s, %s, %s)
        """, (
            asset_id,
            threat_ids,
            score,
            f"Correlated threats within {CORRELATION_WINDOW_MINUTES} mins and similar attributes."
        ))

    conn.commit()

def main():
    print("[*] Running Threat Correlation Engine...")
    threats = fetch_recent_threats()
    correlations = correlate_threats(threats)
    store_correlations(correlations)
    print(f"[+] Correlated {len(correlations)} threat groups.")

if __name__ == "__main__":
    main()
