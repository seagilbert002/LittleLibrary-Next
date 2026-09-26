import { pbkdf2Sync, randomBytes } from "crypto";

export interface HashedCredential {
    hash: string;
    salt: string;
}

/**
 * Computes an O(2^k) key stretched hash using the pbkdf2 over the password
 * with a SHA-256 algorithm
 * @param password Raw plaintext password string
 * @param salt Optional existing salt for verification
 * @returns Object containing salt and hex-encoded key
 */
export function hashPassword(password: string, existingSalt?: string): HashedCredential {
    // Generates salt if not provided
    const salt = existingSalt || randomBytes(16).toString('hex');

    // 100,000 iterations forces 0(2^k) computational cost per attempt
    const iterations = 100000;
    const keyLength = 64;
    const digest = 'sha256';

    const key = pbkdf2Sync(password, salt, iterations, keyLength, digest);

    return {
        hash: key.toString('hex'),
        salt: salt,
    };
}
