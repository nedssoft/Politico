/* eslint-disable no-console */
import passwordHash from 'password-hash';

import pool from '../../config/connection';

const password = passwordHash.generate('password');
const adminPassword = passwordHash.generate('admin');

const user1 = `INSERT INTO users(firstName, lastName, email, phone, password)
                  VALUES('Jon', 'Doe', 'jondoe@gmail.com', '07035087654', '${password}')`;

const admin = `INSERT INTO users(firstName, lastName, isAdmin, email, phone, password)
                  VALUES('Admin', 'Admin', true, 'admin@politico.com', '07080000000', '${adminPassword}')`;

const party1 = `INSERT INTO parties(name, hqAddress, logoUrl)
                    VALUES('Lorem Party of Test', '111, party test address', 'https://res.cloudinary.com/drjpxke9z/image/upload/v1549984207/pdp_nucvwu.jpg')`;

const office1 = `INSERT INTO offices(name, type)
                      VALUES('Lorem Political Office', 'Lorem Political Office Type')`;

const candidate1 = `INSERT INTO candidates(office, candidate, party)
                        VALUES(1, 1, 1)`;
const vote1 = `INSERT INTO votes(office, candidate, voter, party)
                        VALUES(1, 1, 1, 1)`;

const petition1 = `INSERT INTO petitions(office, createdBy, body, evidence)
                      VALUES(1, 1, ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, libero sint sed, excepturi sapiente sunt culpa quidem quibusdam inventore necessitatibus quam alias aliquid? Ab praesentium dicta mollitia aut laudantium deserunt!',
                      '{evidence1.png, evidence2.mp4}')`;

const result1 = `INSERT INTO results(office, candidate, result)
                  VALUES(1, 1, 100000)`;


(async function seedDb() {
  const client = await pool.connect();
  try {
    await client.query(user1);
    await client.query(admin);
    await client.query(party1);
    await client.query(office1);
    await client.query(candidate1);
    await client.query(vote1);
    await client.query(petition1);
    await client.query(result1);
  } catch (err) {
    console.log(err);
  } finally {
    await client.release();
  }
}());
