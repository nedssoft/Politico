import passwordHash from 'password-hash';
import Authenticator from '../helpers/Authenticator';

import pool from '../config/connection';

const { generateToken } = Authenticator;
const defaultImage = 'https://res.cloudinary.com/drjpxke9z/image/upload/v1550322608/avartar_cjvb9n.png';
/**
 * Defines methods for users
 *
 * @class UserController
 */
class UserController {
  /**
   *
   * Creates a user
   * @static
   * @param {object} req - request
   * @param {object} res - response
   * @returns
   * @memberof UserController
   */
  static async createAccount(req, res) {
    const passportUrl = req.body.passportUrl || defaultImage;
    const client = await pool.connect();
    let user;
    try {
      const { firstName, lastName, otherName, phone, email,
        password, isAdmin,
      } = req.body;
      const hashedpassword = passwordHash.generate(password);

      const text = `INSERT INTO users(firstName, lastName, otherName, phone, email, passportUrl, password, isAdmin)
                    VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
                    RETURNING id, firstName, lastName, otherName, phone, email, passportUrl, isAdmin`;
      const values = [firstName, lastName, otherName, phone, email,
        passportUrl, hashedpassword, isAdmin];
      user = await client.query({ text, values });
      if (user.rowCount) {
        user = user.rows[0];
        const { id, isadmin } = user;
        const token = await generateToken({ id, isadmin });
        return res.status(201).json({
          status: 201,
          data: [{ token, user }],
        });
      }
    } catch (err) {
      const { constraint } = err;
      if (constraint === 'users_email_key') {
        return res.status(409).json({ error: true, message: 'User already exists' });
      }
      return res.status(500).json({ error: true, message: 'Internal Server error' });
    } finally {
      await client.release();
    }
  }

  /**
 *
 * Logs in user
 * @static
 * @param {object} req - request
 * @param {object} res - response
 * @returns user object
 * @memberof UserController
 */
  static async loginUser(req, res) {
    const { email, password } = req.body;
    const sqlQuery = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    let user;
    const client = await pool.connect();
    try {
      user = await client.query({ text: sqlQuery, values });
      if (user.rows && user.rowCount) {
        user = user.rows[0];
        if (passwordHash.verify(password, user.password)) {
          const { id, isadmin } = user;
          const token = await generateToken({ id, isadmin });
          return res.status(200).json({ data: [{ token, user }], message: 'Login successful' });
        }
        return res.status(401).json({ error: true, message: 'Invalid email or password' });
      }
      return res.status(401).json({ error: true, message: 'Invalid email or password' });
    } catch (err) {
      return res.status(500).json({ error: true, message: 'Internal server error' });
    } finally {
      client.release();
    }
  }

  static async getAllUsers(req, res) {
    const sqlQuery = `SELECT id,firstname, lastname, othername, phone, email, isadmin, createdon
                          FROM users ORDER BY createdon DESC`;
    let users;
    const client = await pool.connect();
    try {
      users = await client.query(sqlQuery);
      return res.status(200).json({ status: 200, data: users.rows });
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Internal server error' });
    } finally { await client.release(); }
  }
}
export default UserController;
