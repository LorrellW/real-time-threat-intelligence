import os
import requests
import psycopg2
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
from datetime import datetime

"""
change to recieve emails at desired address ::
ALERT_EMAIL = "your@email.com"
SMTP_SERVER = "smtp.yourprovider.com"
SMTP_PORT = 587
EMAIL_USER = "your@email.com"
EMAIL_PASS = "yourpassword"
"""

load_dotenv()
HIBP_API_KEY = os.getenv("HIBP_API_KEY")
VT_API_KEY = os.getenv("VT_API_KEY")

DB_CONN = "dbname=threat_intel user=admin password=securepass"

def get_assets():
    try:
        conn = psycopg2.connect(DB_CONN)
        cur = conn.cursor()
        cur.execute("SELECT id, name, asset_type FROM assets;")
        assets = cur.fetchall()
        cur.close()
        conn.close()
        return assets
    except Exception as e:
        print("Error fetching assets:", e)
        return []

def insert_threat(asset_id, threat_name, likelihood, impact):
    try:
        conn = psycopg2.connect(DB_CONN)
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO threats (asset_id, threat_name, likelihood, impact)
            VALUES (%s, %s, %s, %s);
        """, (asset_id, threat_name, likelihood, impact))
        conn.commit()
        cur.close()
        conn.close()
        print(f"Inserted threat for asset {asset_id}: {threat_name}")
    except Exception as e:
        print("Error inserting threat:", e)

def insert_vulnerability(asset_id, description, severity):
    try:
        conn = psycopg2.connect(DB_CONN)
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO vulnerabilities (asset_id, vulnerability, severity)
            VALUES (%s, %s, %s);
        """, (asset_id, description, severity))
        conn.commit()
        cur.close()
        conn.close()
        print(f"Inserted vulnerability for asset {asset_id}")
    except Exception as e:
        print("Error inserting vulnerability:", e)

def check_hibp(email, asset_id):
    headers = {
        "hibp-api-key": HIBP_API_KEY,
        "user-agent": "osint-checker"
    }
    url = f"https://haveibeenpwned.com/api/v3/breachedaccount/{email}?truncateResponse=true"

    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            breaches = response.json()
            for breach in breaches:
                insert_threat(asset_id, f"HIBP Breach: {breach['Name']}", 3, 4)
        elif response.status_code == 404:
            print(f"No breaches found for {email}")
        else:
            print(f"HIBP error for {email}: {response.status_code}")
    except Exception as e:
        print("HIBP API Error:", e)

def check_virustotal(query, asset_id):
    url = f"https://www.virustotal.com/api/v3/search?query={query}"
    headers = {"x-apikey": VT_API_KEY}

    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            for item in data.get("data", []):
                threat_name = item.get("attributes", {}).get("last_analysis_stats", {})
                total_detections = threat_name.get("malicious", 0)
                if total_detections > 0:
                    insert_vulnerability(asset_id, f"VirusTotal detection for {query}", min(total_detections, 10))
        else:
            print(f"VirusTotal error for {query}: {response.status_code}")
    except Exception as e:
        print("VirusTotal API Error:", e)

def run_osint_scan():
    assets = get_assets()
    for asset_id, name, asset_type in assets:
        print(f"Scanning {asset_type}: {name}")
        if asset_type == "People" and "@" in name:
            check_hibp(name, asset_id)
        elif asset_type in ["Hardware", "Software", "Processes", "Data"]:
            check_virustotal(name, asset_id)
            if asset_type == "Software":
                check_cve_nvd(name, asset_id)

def check_cve_nvd(software_name, asset_id):
    try:
        url = f"https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch={software_name}&resultsPerPage=3"
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            for item in data.get("vulnerabilities", []):
                cve_id = item.get("cve", {}).get("id", "Unknown CVE")
                severity = 5
                try:
                    severity_data = item["cve"]["metrics"]["cvssMetricV31"][0]["cvssData"]
                    severity = int(severity_data["baseScore"]) // 2
                except:
                    pass
                insert_vulnerability(asset_id, f"CVE: {cve_id} for {software_name}", severity)
        else:
            print(f"NVD API error for {software_name}: {response.status_code}")
    except Exception as e:
        print("NVD API Error:", e)

def log_alerts_to_file(threats, log_file="alerts.log"):
    with open(log_file, "a") as f:
        for asset_id, threat_name, risk in threats:
            f.write(f"{datetime.now()} | Asset ID {asset_id} | {threat_name} | Risk: {risk}\n")

def send_email_alert(threats):
    message = "\n".join([f"Asset ID {a} | Threat: {t} | Risk Level: {r}" for a, t, r in threats])
    msg = MIMEText(f"🚨 High-Risk Threats Detected 🚨\n\n{message}")
    msg['Subject'] = "Threat Alert"
    msg['From'] = EMAIL_USER
    msg['To'] = ALERT_EMAIL

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)
        print("📧 Email alert sent.")
    except Exception as e:
        print("Failed to send email alert:", e)

def alert_high_risk_threats():
    try:
        conn = psycopg2.connect(DB_CONN)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT asset_id, threat_name, risk_level 
            FROM threats 
            WHERE risk_level >= 8;
        """)
        high_risk_threats = cursor.fetchall()
        cursor.close()
        conn.close()

        if high_risk_threats:
            print("\n🚨 HIGH-RISK THREATS DETECTED 🚨")
            for asset_id, threat_name, risk in high_risk_threats:
                print(f"[ALERT] Asset ID {asset_id} | Threat: {threat_name} | Risk Level: {risk}")
            send_email_alert(high_risk_threats)
            log_alerts_to_file(high_risk_threats)
        else:
            print("✅ No high-risk threats detected.")
    except Exception as e:
        print("Alert system error:", e)



if __name__ == "__main__":
    run_osint_scan()
    alert_high_risk_threats()
"""
install dependencies :: pip install requests psycopg2-binary python-dotenv
.env ex. :: 
HIBP_API_KEY=your_hibp_key
VT_API_KEY=your_virustotal_key
ex. sql entry: INSERT INTO assets (name, asset_type, category, description)
VALUES ('test@example.com', 'People', 'User Email', 'Example user email');
"""
