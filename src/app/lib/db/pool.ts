import { Pool } from 'pg';

// adds this pool to the global type definition so our pool persists through dev reloads
declare global {
    var postgresPool: Pool | undefined;
}

// Reuse the existing global pool if available otherwise instantiate a new one
const pool =
    global.postgresPool ||
    new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });

// Preserves the connection pool across reloads while in developement
if (process.env.NODE_ENV !== 'production') {
    global.postgresPool = pool;
}

export default pool;
