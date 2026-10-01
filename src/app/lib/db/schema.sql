-- Relational Schema DDL
CREATE TYPE user_role AS ENUM ('ADMIN', 'FRIEND');
CREATE TYPE request_status AS ENUM ('PENDING', 'APPROVED', 'DECLINED', 'CHECKED_OUT', 'RETURNED');
CREATE TYPE alert_level AS ENUM ('NORMAL', 'WARNING_MOLD_RISK', 'CRITICAL');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role user_role DEFAULT 'FRIEND' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(255),
    author          VARCHAR(255),
    first_name      VARCHAR(63),
    last_name       VARCHAR(63),
    genre           VARCHAR(127),
    series          VARCHAR(255),
    description     TEXT,
    publish_date    VARCHAR(16),
    publisher       VARCHAR(64),
    ean_isbn        VARCHAR(64),
    upc_isbn        VARCHAR(64),
    pages           INTEGER,
    ddc             VARCHAR(32),
    cover_style     VARCHAR(32),
    sprayed_edges   BOOLEAN,
    special_ed      BOOLEAN,
    first_ed        BOOLEAN,
    signed          BOOLEAN,
    location        VARCHAR(128),
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE book_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE NOT NULL,
    status request_status DEFAULT 'PENDING' NOT NULL,
    requested_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    approved_at TIMESTAMPTZ,
    returned_at TIMESTAMPTZ,
    admin_notes TEXT
);

CREATE TABLE bookshelf_telemetry (
    id BIGSERIAL PRIMARY KEY,
    shelf_id VARCHAR(50) NOT NULL,
    temperature_c NUMERIC(4,2) NOT NULL,
    humidity_percent NUMERIC(4,2) NOT NULL,
    alert_state alert_level DEFAULT 'NORMAL' NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Performance and Query Optimization Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_requests_user_status ON book_requests(user_id, status);
CREATE INDEX idx_telemetry_shelf_time ON bookshelf_telemetry(shelf_id, recorded_at DESC);
