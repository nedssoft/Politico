import passwordHash from 'password-hash';
import pool from '../config/connection';


class UserModel {
  static async create(req, res) {
    const client = await pool.connect();
    let user;
    try {
      const { firstName, lastName, otherName, phone, email,
        password, passportUrl,
      } = req.body;
      const hashedpassword = passwordHash.generate(password);

      const text = `INSERT INTO users(firstName, lastName, otherName, phone, email, passportUrl, password)
                    VALUES($1, $2, $3, $4, $5, $6, $7) 
                    RETURNING id, firstName, lastName, otherName, phone, email, passportUrl, isAdmin`;
      const values = [firstName, lastName, otherName, phone, email,
        passportUrl, hashedpassword];
      user = await client.query({ text, values });

      return user;
    } catch (err) {
      console.log(err);
      const { constraint } = err;
      if (constraint === 'users_email_key') {
        return res.status(409).json({ error: true, message: 'User already exists' });
      }
      return res.status(500).json({ error: true, message: 'Internal Server error' });
    } finally {
      await client.release();
    }
  }

  static async getUser(column, value) {
    const text = `SELECT * FROM users WHERE ${column} = $1`;
    const values = [value];
    let user;
    const client = await pool.connect();
    try {
      user = await client.query({ text, values });
      if (user.rows && user.rowCount) {
        return user.rows[0];
      }
      return null;
    } catch (err) {
      return null;
    } finally {
      await client.release();
    }
  }
}

export default UserModel;
