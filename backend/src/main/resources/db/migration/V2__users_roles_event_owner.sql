CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(32),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE roles (
    id UUID PRIMARY KEY,
    name VARCHAR(40) NOT NULL UNIQUE
);

CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users (id),
    role_id UUID NOT NULL REFERENCES roles (id),
    PRIMARY KEY (user_id, role_id)
);

INSERT INTO roles (id, name) VALUES
    ('11111111-1111-1111-1111-111111111111', 'CLIENT'),
    ('22222222-2222-2222-2222-222222222222', 'EVENT_MANAGER');

ALTER TABLE events ADD COLUMN owner_id UUID REFERENCES users (id);

CREATE INDEX idx_events_owner_id ON events (owner_id);
CREATE INDEX idx_users_email ON users (email);
