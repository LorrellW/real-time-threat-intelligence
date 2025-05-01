import datetime

def calculate_risk(likelihood: float, impact: float, last_seen: datetime.datetime) -> float:
    """
    Calculate a dynamic risk score based on likelihood, impact, and time since the threat was last seen.

    Args:
        likelihood (float): Likelihood value (e.g., 1–5)
        impact (float): Impact value (e.g., 1–5)
        last_seen (datetime.datetime): Timestamp of the last sighting of the threat

    Returns:
        float: Time-weighted risk score
    """
    days_since_last_seen = (datetime.datetime.now() - last_seen).days
    decay_factor = max(0.1, 1 - (0.05 * days_since_last_seen))  # Prevents score from falling below 10%
    return (likelihood * impact) * decay_factor
