import Authenticator from '../helpers/Authenticator';
import UserModel from '../models/UserModel';

const { create } = UserModel;
const { generateToken } = Authenticator;
class UserController {
  static async createAccount(req, res) {
    let user;

    try {
      user = await create(req, res);
      if (user.rows && user.rowCount) {
        user = user.rows[0];
        const { id, isAdmin } = user;
        const token = await generateToken({ id, isAdmin });
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
}
export default UserController;
