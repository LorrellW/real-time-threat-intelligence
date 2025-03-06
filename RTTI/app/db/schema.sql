-- /db/schema.sql
CREATE TABLE assets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50),
  description TEXT
);

CREATE TABLE threats (
  id SERIAL PRIMARY KEY,
  asset_id INT REFERENCES assets(id),
  threat_name VARCHAR(255),
  risk_level INT CHECK (risk_level BETWEEN 1 AND 10)
);

-- Optionally, add tables for vulnerabilities and risk ratings:
CREATE TABLE vulnerabilities (
  id SERIAL PRIMARY KEY,
  asset_id INT REFERENCES assets(id),
  vulnerability TEXT,
  severity INT CHECK (severity BETWEEN 1 AND 10)
);
