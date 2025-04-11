import os
import requests
import psycopg2
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()
HIBP_API_KEY = os.getenv("HIBP_API_KEY")
VT_API_KEY = os.getenv("VT_API_KEY")
DB_CONN = "dbname=threat_intel user=admin password=securepass"

ALERT_EMAIL = "your@email.com"
SMTP_SERVER = "smtp.yourprovider.com"
SMTP_PORT = 587
EMAIL_USER = "your@email.com"
EMAIL_PASS = "yourpassword"

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

def insert_threat(asset_id, threat_name):
    try:
        conn = psycopg2.connect(DB_CONN)
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO threats (asset_id, threat_name, risk_level)
            VALUES (%s, %s, NULL);
        """, (asset_id, threat_name))
        conn.commit()
        cur.close()
        conn.close()
        print(f"Inserted threat for asset {asset_id}: {threat_name}")
    except Exception as e:
        print("Error inserting threat:", e)
    def log_event(asset_id, threat_id, action, details):
    try:
        conn = psycopg2.connect(DB_CONN)
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO event_log (asset_id, threat_id, action, details)
            VALUES (%s, %s, %s, %s);
        """, (asset_id, threat_id, action, details))
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print("Error logging event:", e)

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
                insert_threat(asset_id, f"HIBP Breach: {breach['Name']}")
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
                stats = item.get("attributes", {}).get("last_analysis_stats", {})
                if stats.get("malicious", 0) > 0:
                    insert_threat(asset_id, f"VirusTotal detection for {query}")
        else:
            print(f"VirusTotal error for {query}: {response.status_code}")
    except Exception as e:
        print("VirusTotal API Error:", e)

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
                    severity = int(severity_data["baseScore"] // 2)
                except:
                    pass
                insert_vulnerability(asset_id, f"CVE: {cve_id} for {software_name}", severity)
        else:
            print(f"NVD API error for {software_name}: {response.status_code}")
    except Exception as e:
        print("NVD API Error:", e)

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

if __name__ == "__main__":
    run_osint_scan()
