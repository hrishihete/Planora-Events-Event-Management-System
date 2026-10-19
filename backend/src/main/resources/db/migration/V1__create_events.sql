CREATE TABLE events (
    id UUID PRIMARY KEY,
    requester_name VARCHAR(120) NOT NULL,
    requester_email VARCHAR(255) NOT NULL,
    requester_phone VARCHAR(32),
    event_name VARCHAR(200) NOT NULL,
    event_type VARCHAR(40) NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    location VARCHAR(255) NOT NULL,
    headcount INTEGER NOT NULL CHECK (headcount >= 1),
    budget_cents BIGINT NOT NULL CHECK (budget_cents >= 0),
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    details TEXT,
    special_requests TEXT,
    status VARCHAR(40) NOT NULL,
    version INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_events_created_at ON events (created_at DESC);
CREATE INDEX idx_events_status ON events (status);
CREATE INDEX idx_events_type ON events (event_type);
