import Helpers from '../helpers/Helpers';
import UserModel from '../models/UserModel';

const { getUser } = UserModel;
const { extractErrors } = Helpers;
/**
 * @description Handles validation for all authentication processes
 */
class AuthValidator {
  /**
   * validates user sign up inputs
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   */
  static validateSignUp(req, res, next) {
    req.check('firstName', 'First Name is required').notEmpty().trim();
    req.check('lastName', 'Last Name is required').notEmpty().trim()
      .isString()
      .withMessage('Last Name must be a string');
    req.check('phone', 'The phone number is required').notEmpty().trim().isString();
    req.check('password', 'Password is required')
      .notEmpty().trim().isLength({ min: 6 })
      .withMessage('password cannot be less then 6 characters');
    req.check('email', 'Email is required').notEmpty().isEmail()
      .withMessage('Invalid email');
    const errors = req.validationErrors();

    if (errors) {
      return res.status(400).json({
        errors: extractErrors(errors),
        error: true,
      });
    }

    return next();
  }

  static async userExists(req, res, next) {
    const { email } = req.body;
    const user = await getUser('email', email);
    if (user) {
      return res.status(409).json({ error: true, message: 'User already exists' });
    }
    return next();
  }
}

export default AuthValidator;
