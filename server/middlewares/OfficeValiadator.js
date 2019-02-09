import Helpers from '../helpers/Helpers';
import pool from '../config/connection';

const { extractErrors } = Helpers;
/**
 * @description Defines validations for Office endpoints
 * @class OfficeValidator
 */
class OfficeValidator {
  static validateOffice(req, res, next) {
    if (req.method === 'POST') {
      req.checkBody('name', 'The political office name is required').notEmpty().trim().isLength({ min: 3 })
        .withMessage('The office name must be at leat 3 characters long')
        .not()
        .isNumeric()
        .withMessage('The office name cannot be a number');

      req.check('type', 'The political office type is required').notEmpty().trim().isLength({ min: 3 })
        .withMessage('The political office type must be at least 3 characters long')
        .not()
        .isNumeric()
        .withMessage('The political office type cannot be a number');
    } else if (req.method === 'GET') {
      req.checkParams('officeId', 'The office ID must be an integer').notEmpty().isInt();
    }
    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({ status: 400, errors: extractErrors(errors) });
    }
    if (req.method === 'POST') {
      const { name, type } = req.body;
      req.body.name = name.replace(/\s{2,}/g, ' ');
      req.body.type = type.replace(/\s{2,}/g, ' ');
    }
    return next();
  }

  /**
 *
 * Checks if an office already exists
 * to ensure there's no duplicate entry
 * @static
 * @param {object} req - request
 * @param {object} res - response
 * @param {object} next - callback
 * @returns
 * @memberof OfficeValidator
 */
  static async isDuplicateOffice(req, res, next) {
    const client = await pool.connect();
    let party;
    try {
      const sqlQuery = 'SELECT * FROM offices WHERE LOWER(name) = LOWER($1) LIMIT 1';
      const values = [req.body.name];
      party = await client.query({ text: sqlQuery, values });
      if (party.rowCount) {
        return res.status(409).json({
          status: 409,
          error: 'The office already exists',
        });
      }
    } catch (err) {
      return;
    } finally {
      await client.release();
    }
    return next();
  }
}
export default OfficeValidator;
