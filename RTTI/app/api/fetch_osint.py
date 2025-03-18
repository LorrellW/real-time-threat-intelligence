import requests
import psycopg2
import os

# Load API key from environment variables
SHODAN_API_KEY = os.getenv("SHODAN_API_KEY")
IP = "8.8.8.8"  # Example IP, replace with actual scanning targets

# PostgreSQL connection details
DB_PARAMS = {
    "dbname": "threat_intel",
    "user": "admin",
    "password": "securepass",
    "host": "localhost",
    "port": "5432",
}

# Function to fetch data from Shodan
def fetch_shodan_data(ip):
    url = f"https://api.shodan.io/shodan/host/{ip}?key={SHODAN_API_KEY}"
    response = requests.get(url)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching Shodan data: {response.status_code}")
        return None

# Function to store threat data in the existing threats table
def store_threat_data(asset_id, threat_name, risk_level):
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()
        
        query = """
        INSERT INTO threats (asset_id, threat_name, risk_level)
        VALUES (%s, %s, %s)
        """
        cursor.execute(query, (asset_id, threat_name, risk_level))
        
        conn.commit()
        cursor.close()
        conn.close()
        print(f"Stored threat: {threat_name} with risk level {risk_level} for asset {asset_id}")

    except Exception as e:
        print(f"Database error: {e}")

# Fetch data from Shodan
shodan_data = fetch_shodan_data(IP)

if shodan_data:
    asset_id = 1  # Replace with actual asset mapping logic
    for port in shodan_data.get("ports", []):
        threat_name = f"Open port detected: {port}"
        risk_level = 7  # Example risk level, can be dynamically calculated
        store_threat_data(asset_id, threat_name, risk_level)
