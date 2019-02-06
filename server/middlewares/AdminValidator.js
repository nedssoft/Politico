import Helpers from '../helpers/Helpers';
import pool from '../config/connection';


const { extractErrors } = Helpers;
/**
 * Defines methods for validating Admin functions
 *
 * @class AdminValidator
 */
class AdminValidator {
  static validateCandidate(req, res, next) {
    req.check('office', 'The aspirant\'s office is required')
      .notEmpty().trim()
      .isNumeric()
      .withMessage('The office must be a number');

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({
        status: 400,
        errors: extractErrors(errors),
      });
    }
    next();
  }

  /**
 *
 * Ensures that the office referenced exists in the database
 * @static
 * @param {object} req -request
 * @param {object} res - response
 * @param {object} next - callback
 * @returns
 * @memberof AdminValidator
 */
  static async checkIfOfficeExists(req, res, next) {
    const { office } = req.body;
    const client = await pool.connect();
    try {
      const sqlQuery = { text: 'SELECT * FROM offices WHERE id = $1', values: [office] };
      const officeExists = await client.query(sqlQuery);
      if (!officeExists.rowCount) {
        return res.status(404).json({
          status: 404,
          error: 'The office does not exist',
        });
      }
    } catch (err) {
      return;
    } finally {
      await client.release();
    }
    next();
  }

  /**
 *
 * Ensures that the referenced party exists in the database
 * @static
 * @param {object} req - request
 * @param {object} res - response
 * @param {object} next - callback
 * @returns
 * @memberof AdminValidator
 */
  static async checkIfPartyExists(req, res, next) {
    const { party } = req.body;
    const client = await pool.connect();

    try {
      const sqlQuery = { text: 'SELECT * FROM parties WHERE id = $1', values: [party] };
      const partyExists = await client.query(sqlQuery);
      if (!partyExists.rowCount) {
        return res.status(400).json({
          status: 400,
          error: 'The party does not exist',
        });
      }
    } catch (err) {
      return;
    } finally {
      await client.release();
    }
    return next();
  }

  /**
 *
 * Ensures that the userId is a number
 * @static
 * @param {object} req - request
 * @param {object} res - response
 * @param {object} next - callback
 * @returns
 * @memberof AdminValidator
 */
  static validateUserId(req, res, next) {
    const { userId } = req.params;
    console.log(userId);
    if (userId && !Helpers.isANumber(userId)) {
      return res.status(400).json({
        status: 400,
        error: 'The user ID must be a number',
      });
    }
    if (!userId) {
      return res.status(400).json({
        status: 400,
        error: 'The user ID is required',
      });
    }
    return next();
  }

  /**
 *
 * Ensures that the refernced user exists in the database
 * @static
 * @param {object} req - request
 * @param {object} res - response
 * @param {object} next - callback
 * @returns
 * @memberof AdminValidator
 */
  static async checkIfUserExists(req, res, next) {
    const { userId } = req.params;
    const client = await pool.connect();

    try {
      const sqlQuery = { text: 'SELECT * FROM users WHERE id = $1', values: [userId] };
      const candidateExists = await client.query(sqlQuery);
      if (!candidateExists.rowCount) {
        return res.status(404).json({
          status: 404,
          error: 'The user does not exist',
        });
      }
    } catch (err) {
      return;
    } finally {
      await client.release();
    }
    req.body.userId = userId;
    next();
  }
}
export default AdminValidator;
