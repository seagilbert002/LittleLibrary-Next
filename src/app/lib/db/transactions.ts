import pool from './pool';

/**
 * Executes book checkout request with an atomic ACID transaction.
 * Prevents race conditions and guarantees consistency
 */
export async function approvalLoanTransaction(requestId: string, adminNotes: string) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Parameterized 
        const requestRes = await client.query(
            `SELECT book_id, status FROM book_requests WHERE id = $1 FOR UPDATE`, [requestId]
        );

        if (requestRes.rows.length === 0) {
            throw new Error('Request not found');
        }

        const { book_id, status } = requestRes.rows[0];
        
        // Check for the proper status of the book
        if (status !== 'PENDING') {
            throw new Error('Request has already been processed');
        }

        // Mark the book as unavailable
        await client.query(
            `UPDATE books SET is_available = FALSE WHERE id = $1`, [book_id]
        );

        // Update request to APPROVED
        await client.query(
            `UPDATE book_requests
            SET status = 'APPROVED', approved_at = NOW(), adminNotes = $2
            WHERE id = $1`, [requestId, adminNotes]
        );

        // Automatically Decline any competing request
        await client.query(
            `UPDATE book_requests
            SET status = 'DECLINED', adminNotes = 'Auto-declined: Book checkout by another user' 
            WHERE book_id = $1 AND id != $2 AND status = 'PENDING'`, [book_id, requestId]
        );

        // Commit the changes atomically
        await client.query('COMMIT');
        return { success: true, message: 'Loan approved successfully' };

    } catch (error) {
        // Rollback all queries if any step fails
        await client.query('ROLLBACK');
        console.error('Transaction failed, changes rolled back:', error);
        throw error;

    } finally {
        // Releases the connection client back to the pool
        client.release();
    }
}
