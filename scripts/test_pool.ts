import pool from '../src/app/lib/db/pool';

async function testPoolConnection() {
    console.log('Attempting to connect to PostgreSQL pool...');

    try {
        // Aquire a client from the pool to test the query execution
        const client = await pool.connect();
        console.log('Successfully aquired connection client from pool');

        // Execute a test query
        const result = await client.query('SELECT COUNT(*) FROM books;');
        console.log(`Database query successful! Total books in database: ${result.rows[0].count}`);

        // Release the client back to pool
        client.release();
        console.log('Released client to pool');

    } catch (err) {
        console.error('X Connection pool test failed', err);
    } finally {
        // End pool to exit cleanly
        await pool.end();
        console.log('Pool shutdown complete');
    }
}

testPoolConnection();
