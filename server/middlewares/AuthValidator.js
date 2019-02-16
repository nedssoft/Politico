import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Helpers from '../helpers/Helpers';
import Authenticator from '../helpers/Authenticator';
import pool from '../config/connection';

const { extractErrors } = Helpers;
const { verifyToken } = Authenticator;
dotenv.config();

/* istanbul ignore next */
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
    req.check('lastName', 'Last Name is required').notEmpty().trim();
    req.check('phone', 'The phone number is required').notEmpty().trim()
      .isLength({ min: 11 })
      .withMessage('Enter a valid phone number');
    req.check('password', 'Password is required')
      .notEmpty().trim().isLength({ min: 6 })
      .withMessage('password cannot be less then 6 characters');
    req.check('email', 'Email is required').notEmpty().isEmail()
      .withMessage('Invalid email');
    const errors = req.validationErrors();

    if (errors) {
      return res.status(400).json({
        errors: extractErrors(errors),
        status: 400,
      });
    }
    return next();
  }

  static async userExists(req, res, next) {
    const { email } = req.body;
    const sqlQuery = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    let user;
    const client = await pool.connect();
    try {
      user = await client.query({ text: sqlQuery, values });
      if (user.rows && user.rowCount) {
        return res.status(409).json({
          status: 409, error: `User with email ${email} already exists`,
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      client.release();
    }
    return next();
  }

  static async validatePhone(req, res, next) {
    const { phone } = req.body;
    const sqlQuery = 'SELECT * FROM users WHERE phone = $1';
    const values = [phone];
    let user;
    const client = await pool.connect();
    try {
      user = await client.query({ text: sqlQuery, values });
      if (user.rows && user.rowCount) {
        return res.status(409).json({
          status: 409, error: `User with phone number ${phone} already exists`,
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      client.release();
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
        status: 400,
      });
    }
    return next();
  }

  /* istanbul ignore next */
  static isAuthenticated(req, res, next) {
    try {
      const authorization = req.headers.authorization.split(' ')[1] || req.headers.token;
      if (!authorization) {
        return res.status(401).json({ status: 401, message: 'Access denied, Authorization required' });
      }
      const verifiedToken = verifyToken(authorization);
      if (!verifiedToken.id) {
        return res.status(401).json({ status: 401, message: 'Access denied, Authorization required' });
      }
    } catch (err) {
      return res.status(401).json({ status: 401, message: 'Access denied, Authorization required' });
    }
    return next();
  }

  static isAdmin(req, res, next) {
    try {
      const authorization = req.headers.authorization.split(' ')[1] || req.headers.token;

      if (!authorization) {
        return res.status(401).json({ status: 401, message: 'Only an Admin has the right to create a party' });
      }

      const verifiedToken = verifyToken(authorization);
      if (!verifiedToken.isadmin) {
        return res.status(401).json({ status: 401, message: 'Only an Admin has the right to create a party' });
      }
    } catch (err) {
      return res.status(401).json({ status: 401, message: 'Only an Admin has the right to create a party' });
    }
    return next();
  }

  /**
 *
 * Validates authorization token
 * @static
 * @param {object} req - request
 * @param {object} res - response
 * @param {object} next - callback
 * @returns
 * @memberof AuthValidator
 */
  static checkToken(req, res, next) {
    try {
      let authorization;
      if (req.headers.token) authorization = req.headers.token;
      else if (req.headers.authorization) authorization = req.headers.authorization.split(' ')[1];
      if (!authorization) {
        return res.status(401).json({ status: 401, error: 'You must log in to vote' });
      }
      jwt.verify(authorization, process.env.SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ status: 401, error: 'Invalid Authorization token' });
        }
        req.body.token = decoded;
        next();
      });
    } catch (err) {
      return res.status(401).json({ status: 401, error: 'Invalid Authorization token' });
    }
  }
}

export default AuthValidator;
