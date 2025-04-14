import psycopg2
from datetime import datetime

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
REM_MEDIATION_THRESHOLD = 8

# Simulated external remediation functions
def quarantine_asset(asset_id):
    print(f"[!] Quarantining asset {asset_id}")
    return True

def revoke_tokens(asset_id):
    print(f"[!] Revoking tokens for asset {asset_id}")
    return True

def notify_team(asset_id, threat_name):
    print(f"[!] Notifying SOC team about {threat_name} on asset {asset_id}")
    return True

# Fetch high-risk threats that haven't been remediated
def fetch_unremediated_threats():
    cur.execute("""
        SELECT id, asset_id, threat_name, risk_level
        FROM threats
        WHERE risk_level >= %s
        AND id NOT IN (
            SELECT threat_id FROM remediation_actions
        )
    """, (REM_MEDIATION_THRESHOLD,))
    return cur.fetchall()

# Take automated countermeasures
def remediate_threat(threat_id, asset_id, threat_name):
    success = True
    notes = []

    if quarantine_asset(asset_id):
        notes.append("Asset quarantined.")
    else:
        success = False
        notes.append("Quarantine failed.")

    if revoke_tokens(asset_id):
        notes.append("Tokens revoked.")
    else:
        success = False
        notes.append("Token revocation failed.")

    if notify_team(asset_id, threat_name):
        notes.append("Team notified.")

    cur.execute("""
        INSERT INTO remediation_actions (asset_id, threat_id, action_taken, initiated_by, success, notes)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        asset_id,
        threat_id,
        "quarantine, revoke_tokens, notify_team",
        "automated",
        success,
        " | ".join(notes)
    ))

    conn.commit()

# Main process
def main():
    print("[*] Running Remediation Engine...")
    threats = fetch_unremediated_threats()

    if not threats:
        print("[+] No high-risk threats pending remediation.")
        return

    for tid, aid, name, risk in threats:
        print(f"[-] Remediating threat {name} (Risk: {risk}) on asset {aid}")
        remediate_threat(tid, aid, name)

    print(f"[+] Processed {len(threats)} threats for remediation.")

if __name__ == "__main__":
    main()
