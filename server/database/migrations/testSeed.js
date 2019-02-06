import pool from '../../config/connection';

const party1 = `INSERT INTO parties(name, hqAddress, logoUrl)
                    VALUES('Lorem Party of Test placeholder', '1111, party test address', 'partyy.png')`;

const office1 = `INSERT INTO offices(name, type)
                      VALUES('Lorem Political Officec', 'Lorem Political Office Typee')`;
const candidate1 = `INSERT INTO candidates(office, candidate)
                      VALUES(1, 1)`;
(async function seedDb() {
  const client = await pool.connect();
  try {
    await client.query(party1);
    await client.query(office1);
    await client.query(candidate1);
  } catch (err) {
    return;
  } finally {
    await client.release();
  }
}());
