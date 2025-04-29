import psycopg2
import json
from datetime import datetime, timedelta
import statistics

# Connect to your PostgreSQL DB
conn = psycopg2.connect(
    dbname="threat_intel",
    user="admin",
    password="securepass",
    host="localhost",
    port=5432
)

cur = conn.cursor()

# CONFIGURABLE THRESHOLDS
Z_THRESHOLD = 2.5
ANALYSIS_WINDOW_HOURS = 12

def fetch_behavior_data():
    cur.execute("""
        SELECT asset_id, event_type, recorded_at
        FROM behavior_logs
        WHERE recorded_at > NOW() - INTERVAL '%s HOURS'
    """, (ANALYSIS_WINDOW_HOURS,))
    return cur.fetchall()

def detect_anomalies(events):
    anomaly_alerts = []
    grouped = {}

    for asset_id, event_type, ts in events:
        key = (asset_id, event_type)
        grouped.setdefault(key, []).append(ts)

    for (asset_id, event_type), timestamps in grouped.items():
        hours = [(t.hour + t.minute / 60.0) for t in timestamps]
        if len(hours) >= 5:
            mean = statistics.mean(hours)
            stdev = statistics.stdev(hours)
            for t in hours:
                z = abs((t - mean) / stdev) if stdev > 0 else 0
                if z > Z_THRESHOLD:
                    anomaly_alerts.append((asset_id, event_type, z))

    return anomaly_alerts

def log_anomalies(anomalies):
    for asset_id, event_type, z_score in anomalies:
        print(f"[!] Anomaly Detected: Asset {asset_id}, Event {event_type}, Z-Score {z_score:.2f}")

        # Insert into event_log
        cur.execute("""
            INSERT INTO event_log (asset_id, action, threat_id, details)
            VALUES (%s, %s, NULL, %s)
        """, (
            asset_id,
            "anomaly_detected",
            f"Behavior anomaly detected in '{event_type}' (z-score: {z_score:.2f})"
        ))

        # Optionally add to threats table
        cur.execute("""
            INSERT INTO threats (asset_id, threat_name, risk_level, likelihood, impact)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            asset_id,
            f"Behavioral Anomaly - {event_type}",
            7,
            3,
            3
        ))

    conn.commit()

def main():
    events = fetch_behavior_data()
    anomalies = detect_anomalies(events)
    log_anomalies(anomalies)

if __name__ == "__main__":
    main()
