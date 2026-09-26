import { timingSafeEqual } from 'crypto';
import { hashPassword } from './key_stretch_hash';

/**
 * Executes with a O(n) for a constant time string comparison to prevent
 * timing analysis exploits.
 * @param providedPassword User entered password 
 * @param storedHash Stored hash for the associated username
 * @param salt Stored salt for the associated hash
 * @returns boolean Indication of success or failure of the verification
 */
export function verifyPasswordHash(providedPassword: string, storedHash: string, salt: string): boolean {
    // Compute the key stretch hash using the stored salt
    const { hash: computedHash } = hashPassword(providedPassword, salt);

    // Create hex byte buffers for comparison
    const computedBuffer = Buffer.from(computedHash, 'hex');
    const storedBuffer = Buffer.from(storedHash, 'hex');

    // A length mismatch will fail immediately, otherwise they continue to the timingSafeEqual comparison
    if (computedBuffer.length !== storedBuffer.length) {
        return false;
    }

    // The Node crypto.timingSafeEqual evaluates every byte regarless of an early mismatch
    return timingSafeEqual(computedBuffer, storedBuffer);
}
