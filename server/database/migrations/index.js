import debug from 'debug';
import pool from '../../config/connection';
import tables from './tables';

const debugg = debug('migration');
(async function migrate() {
  debugg('migrating...');
  const client = await pool.connect();
  try {
    debugg('migrating users..');
    await client.query(tables.users);

    debugg('migrating parties..');
    await client.query(tables.parties);

    debugg('migrating offices..');
    await client.query(tables.offices);

    debugg('migrating candidates..');
    await client.query(tables.candidates);

    debugg('migrating votes..');
    await client.query(tables.votes);

    debugg('migrating petitions..');
    await client.query(tables.petitions);

    debugg('migrating results..');
    await client.query(tables.restults);
  } catch (err) {
    return;
  } finally {
    await client.release();
    debugg('migration completed');
  }
}());
