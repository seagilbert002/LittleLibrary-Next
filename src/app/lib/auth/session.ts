import crypto from 'crypto';
import { cookies } from 'next/headers';
import pool from '../db/pool';

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Persists a new session token into PostgreSQL and sets an HTTP-Only cookies
 */
export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    const sessionId = crypto.randomBytes(32).toString('hex');

    // Insert session into active sessions
    await pool.query(
        `INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3`, [sessionId, userId, expiresAt]
    );

    const cookieStore = await cookies()
    cookieStore.set('session', sessionId, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
}
