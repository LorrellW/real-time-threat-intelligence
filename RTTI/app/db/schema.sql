-- db/schema.sql
BEGIN;

-- ───────────────────────────
-- Base tables
-- ───────────────────────────
DROP TABLE IF EXISTS remediation_actions;
DROP TABLE IF EXISTS threat_events;
DROP TABLE IF EXISTS behavior_logs;
DROP TABLE IF EXISTS tva_mapping;
DROP TABLE IF EXISTS vulnerabilities;
DROP TABLE IF EXISTS event_log;
DROP TABLE IF EXISTS threats;
DROP TABLE IF EXISTS assets;

CREATE TABLE assets (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(255) NOT NULL,
  asset_type   VARCHAR(50)  CHECK (asset_type IN ('Hardware','Software','Data','People','Processes')),
  category     VARCHAR(50),
  description  TEXT,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  audited      BOOLEAN   DEFAULT FALSE
);

-- Threats table must exist before FK references
CREATE TABLE threats (
  id          SERIAL PRIMARY KEY,
  asset_id    INT REFERENCES assets(id) ON DELETE CASCADE,
  threat_name VARCHAR(255),
  likelihood  INT CHECK (likelihood BETWEEN 1 AND 5),
  impact      INT CHECK (impact BETWEEN 1 AND 5)
);
-- add generated column after basics are defined
ALTER TABLE threats
  ADD COLUMN risk_score INT GENERATED ALWAYS AS (likelihood * impact) STORED;

-- TVA mapping (threat–vulnerability–asset)
CREATE TABLE tva_mapping (
  id              SERIAL PRIMARY KEY,
  asset_id        INT REFERENCES assets(id)   ON DELETE CASCADE,
  threat_id       INT REFERENCES threats(id)  ON DELETE CASCADE,
  vulnerability_description TEXT NOT NULL,
  likelihood      INT CHECK (likelihood BETWEEN 1 AND 5),
  impact          INT CHECK (impact BETWEEN 1 AND 5),
  risk_score      INT GENERATED ALWAYS AS (likelihood * impact) STORED,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Behaviour / telemetry logs
CREATE TABLE behavior_logs (
  id          SERIAL PRIMARY KEY,
  asset_id    INT REFERENCES assets(id) ON DELETE CASCADE,
  user_id     VARCHAR(255),
  event_type  VARCHAR(100),  -- e.g. login_attempt
  event_data  JSONB,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Correlated threat events
CREATE TABLE threat_events (
  id                SERIAL PRIMARY KEY,
  asset_id          INT REFERENCES assets(id) ON DELETE CASCADE,
  threat_ids        INT[] ,                   -- correlated threat IDs
  correlation_score INT CHECK (correlation_score BETWEEN 1 AND 100),
  detection_notes   TEXT,
  detected_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Remediation actions
CREATE TABLE remediation_actions (
  id            SERIAL PRIMARY KEY,
  asset_id      INT REFERENCES assets(id)   ON DELETE CASCADE,
  threat_id     INT REFERENCES threats(id)  ON DELETE CASCADE,
  action_taken  TEXT,
  initiated_by  VARCHAR(255),
  success       BOOLEAN,
  notes         TEXT,
  performed_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MITRE ATT&CK look-ups
CREATE TABLE mitre_mappings (
  id             SERIAL PRIMARY KEY,
  threat_name    VARCHAR(255),
  tactic         VARCHAR(255),
  technique_id   VARCHAR(50),
  technique_name VARCHAR(255)
);

-- Generic event log
CREATE TABLE event_log (
  id           SERIAL PRIMARY KEY,
  asset_id     INT,
  action       TEXT,
  threat_id    INT,
  details      TEXT,
  performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional vulnerabilities table
CREATE TABLE vulnerabilities (
  id          SERIAL PRIMARY KEY,
  asset_id    INT REFERENCES assets(id) ON DELETE CASCADE,
  vulnerability TEXT,
  severity      INT CHECK (severity BETWEEN 1 AND 10)
);

-- ───────────────────────────
-- Indexes
-- ───────────────────────────
CREATE INDEX idx_behavior_logs_asset    ON behavior_logs(asset_id);
CREATE INDEX idx_event_log_asset        ON event_log(asset_id);
CREATE INDEX idx_threat_events_asset    ON threat_events(asset_id);
CREATE INDEX idx_remediation_actions_asset ON remediation_actions(asset_id);

COMMIT;
