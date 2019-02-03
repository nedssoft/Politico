import debug from 'debug';
import pool from '../../config/connection';

const debugg = debug('migrate:reset');

(async function migrateReset() {
  const client = await pool.connect();
  try {
    debugg('rolling back migrations...');
    await client.query('DROP TABLE IF EXISTS users CASCADE');
    await client.query('DROP TABLE IF EXISTS offices CASCADE');
    await client.query('DROP TABLE IF EXISTS parties CASCADE');
    await client.query('DROP TABLE IF EXISTS candidates CASCADE');
    await client.query('DROP TABLE IF EXISTS votes CASCADE');
    await client.query('DROP TABLE IF EXISTS results CASCADE');
    await client.query('DROP TABLE IF EXISTS petitions CASCADE');
  } catch (err) {
    debugg(err);
  } finally {
    await client.release();
    debugg('roll back completed');
  }
}());
