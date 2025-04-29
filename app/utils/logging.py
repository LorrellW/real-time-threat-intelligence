import logging

logging.basicConfig(filename='logs/threat_events.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def log_threat(threat, risk_score):
    logging.info(f"{threat} detected with risk score: {risk_score}")

log_threat("DDoS Attack", 30)