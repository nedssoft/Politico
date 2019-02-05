import passwordHash from 'password-hash';
import Authenticator from '../helpers/Authenticator';
import UserModel from '../models/UserModel';

const { create, getUser } = UserModel;
const { generateToken } = Authenticator;
class UserController {
  static async createAccount(req, res) {
    let user;

    try {
      user = await create(req, res);
      if (user.rows && user.rowCount) {
        user = user.rows[0];
        const { id, isadmin } = user;
        const token = await generateToken({ id, isadmin });
        return res.status(201).json({
          status: 201,
          data: [{ token, user }],
        });
      }
    } catch (err) {
      return res.status(500).json({
        error: true,
        message: 'Unable to create user account',
      });
    }
  }

  static async loginUser(req, res) {
    const { email, password } = req.body;
    try {
      const user = await getUser('email', email);
      if (!user) {
        return res.status(401).json({ error: true, message: 'Invalid email or password' });
      }
      if (passwordHash.verify(password, user.password)) {
        const { id, isAdmin } = user;
        const token = await generateToken({ id, isAdmin });
        return res.status(200).json({ data: [{ token, user }], message: 'Login successful' });
      }
      return res.status(401).json({ error: true, message: 'Invalid email or password' });
    } catch (err) {
      return res.status(500).json({ error: true, message: 'Internal server error' });
    }
  }
}
export default UserController;
