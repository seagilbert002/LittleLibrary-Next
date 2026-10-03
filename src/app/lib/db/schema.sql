-- Relational Schema DDL
CREATE TYPE user_role AS ENUM ('ADMIN', 'FRIEND');
CREATE TYPE request_status AS ENUM ('PENDING', 'APPROVED', 'DECLINED', 'CHECKED_OUT', 'RETURNED');
CREATE TYPE alert_level AS ENUM ('NORMAL', 'WARNING_MOLD_RISK', 'CRITICAL');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    password_salt VARCHAR(32) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role user_role DEFAULT 'FRIEND' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE book_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE NOT NULL,
    status request_status DEFAULT 'PENDING' NOT NULL,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    approved_at TIMESTAMP,
    returned_at TIMESTAMP,
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
CREATE INDEX idx_requests_user_status ON book_requests(user_id, status);
CREATE INDEX idx_telemetry_shelf_time ON bookshelf_telemetry(shelf_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_book_requests_book_id ON book_requests(book_id);
CREATE INDEX IF NOT EXISTS idx_books_author_title ON books(author, title);
CREATE INDEX IF NOT EXISTS idx_books_genre ON books(genre);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
