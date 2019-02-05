import Helpers from '../helpers/Helpers';
import UserModel from '../models/UserModel';
import Authenticator from '../helpers/Authenticator';

const { getUser } = UserModel;
const { extractErrors } = Helpers;
const { verifyToken } = Authenticator;
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

  static validateLogin(req, res, next) {
    req.check('email', 'Email is required').notEmpty().isEmail().trim()
      .withMessage('Invalid email');
    req.check('password', 'Password is required').notEmpty().trim();

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({
        errors: extractErrors(errors),
        error: true,
      });
    }
    return next();
  }

  static isAuthenticated(req, res, next) {
    try {
      const authorization = req.headers.authorization.split(' ')[1] || req.headers.token;
      if (!authorization) {
        return res.status(401).json({ error: true, message: 'Access denied, Authorization required' });
      }
      const verifiedToken = verifyToken(authorization);
      if (!verifiedToken.id) {
        return res.status(401).json({ error: true, message: 'Access denied, Authorization required' });
      }
    } catch (err) {
      return res.status(401).json({ error: true, message: 'Access denied, Authorization required' });
    }
    return next();
  }

  static isAdmin(req, res, next) {
    try {
      const authorization = req.headers.authorization.split(' ')[1] || req.headers.token;

      if (!authorization) {
        return res.status(401).json({ error: true, message: 'Unauthorized, Authorization required' });
      }
      const verifiedToken = verifyToken(authorization);

      if (!verifiedToken.isadmin) {
        return res.status(401).json({ error: true, message: 'Unauthorized, Authorization required' });
      }
    } catch (err) {
      return res.status(401).json({ error: true, message: 'Unauthorized, Authorization required' });
    }
    return next();
  }
}

export default AuthValidator;
