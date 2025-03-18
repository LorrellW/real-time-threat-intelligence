-- /db/schema.sql
DROP TABLE IF EXISTS tva_mapping;
DROP TABLE IF EXISTS assets;

CREATE TABLE assets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  asset_type VARCHAR(50) CHECK (asset_type IN ('Hardware', 'Software', 'Data', 'People', 'Processes')),
  category VARCHAR(50),
  description TEXT
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tva_mapping (
    id SERIAL PRIMARY KEY,
    asset_id INT REFERENCES assets(id) ON DELETE CASCADE,
    threat_name VARCHAR(255) NOT NULL,
    vulnerability_description TEXT NOT NULL,
    likelihood INT CHECK (likelihood BETWEEN 1 AND 5),
    impact INT CHECK (impact BETWEEN 1 AND 5),
    risk_score INT GENERATED ALWAYS AS (likelihood * impact) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE threats (
  id SERIAL PRIMARY KEY,
  asset_id INT REFERENCES assets(id),
  threat_name VARCHAR(255),
  risk_level INT CHECK (risk_level BETWEEN 1 AND 10)
);

ALTER TABLE threats
ADD COLUMN likelihood INT CHECK (likelihood BETWEEN 1 AND 5),
ADD COLUMN impact INT CHECK (impact BETWEEN 1 AND 5),
ADD COLUMN risk_score INT GENERATED ALWAYS AS (likelihood * impact) STORED;

-- Optionally, add tables for vulnerabilities and risk ratings:
CREATE TABLE vulnerabilities (
  id SERIAL PRIMARY KEY,
  asset_id INT REFERENCES assets(id),
  vulnerability TEXT,
  severity INT CHECK (severity BETWEEN 1 AND 10)
);
