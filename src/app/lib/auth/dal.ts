import 'server-only'

import { cookies } from 'next/headers'
import { cache } from 'react';
import { redirect } from 'next/navigation';
import pool from '@/app/lib/db/pool';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: string;
}

// verifications of the session token against what is in our database
export const verifySession = cache(async () => {
    const sessionId = (await cookies()).get('session')?.value;

    if (!sessionId) {
        redirect('/login');
    }

    // Verification through raw SQL
    const sessionResult = await pool.query<{ user_id: string }>(
        `SELECT user_id FROM sessions WHERE id = $1 AND expires_at > NOW()`, [sessionId]
    );

    if (sessionResult.rows.length === 0) {
        redirect('/login');
    }

    return { isAuth: true, userId: sessionResult.rows[0].user_id };
});

// TODO: Add getUser() 
/**
 * Fetches the authenticated user profile using raw SQL
 */
export const getUser = cache(async (): Promise<UserProfile | null> => {
    const session = await verifySession();
    if (!session?.userId) return null;

    try {
        // Fetch specific user fields using parameterization
        const userResult = await pool.query<UserProfile>(
            `SELECT id, name, email, role FROM users WHERE id = $1`,
                [session.userId]
        );

        if (userResult.rows.length === 0) {
            return null;
        }

        return userResult.rows[0];
    } catch (error) {
        console.error('Failed to fetch authenticated user:', error);
        return null;
    }
});
