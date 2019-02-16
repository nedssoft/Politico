import helpers from '../helpers/Helpers';
import pool from '../config/connection';

/**
 * Defines methods to validate party endpoints
 * @class PartyValidator
 */
class PartyValidator {
  /**
   *@description Validates create party endpoint
   *@static
   * @param {object} req - request
   * @param {object} res - response
   * @param {object} next - callback
   */
  static partyValidator(req, res, next) {
    if (req.method === 'POST') {
      req.checkBody('name', 'The party name is required').notEmpty().trim().isLength({ min: 3 })
        .withMessage('The party name must be at leat 3 characters long')
        .not()
        .isNumeric()
        .withMessage('The party name cannot be a number');
      req.checkBody('hqAddress', 'The party HQ Address is required').notEmpty().trim()
        .not()
        .isNumeric()
        .withMessage('The hqAddress name must be a string');
    } else if (req.method === 'DELETE') {
      req.checkParams('partyId', 'The party ID must be an integer').notEmpty().isInt();
    } else if (req.method === 'PATCH') {
      req.checkParams('partyId', 'The party ID must be an integer').notEmpty().isInt();
      req.checkBody('name', 'The party name is required')
        .notEmpty().trim()
        .isLength({ min: 3 })
        .withMessage('The party name must be at leat 3 characters long')
        .not()
        .isNumeric()
        .withMessage('The party name cannot be a number');
    }
    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({
        status: 400,
        errors: helpers.extractErrors(errors),
      });
    }
    if (req.method === 'POST') {
      const { name, hqAddress } = req.body;
      req.body.name = name.replace(/\s{2,}/g, ' ');
      req.body.hqAddress = hqAddress.replace(/\s{2,}/g, ' ');
    }
    return next();
  }

  /**
 * Checks if a party is already register
 * to avoid duplicate entry
 *
 * @static
 * @param {object} req - request
 * @param {object} res - response
 * @param {object} next - callback
 * @returns
 * @memberof PartyValidator
 */
  static async isDuplicate(req, res, next) {
    const client = await pool.connect();
    let party;
    try {
      const sqlQuery = 'SELECT * FROM parties WHERE LOWER(name) = LOWER($1) LIMIT 1';
      const values = [req.body.name];
      party = await client.query({ text: sqlQuery, values });
      if (party.rowCount) {
        return res.status(409).json({
          status: 409,
          error: 'The party already exists',
        });
      }
    } catch (err) {
      return res.status(500).json({ status: 500, message: 'Internal server error' });
    } finally {
      await client.release();
    }
    return next();
  }

  /**
   * Validates params Id
   * @static
   * @param {object} req - request
   * @param {object} res - response
   * @param {object} next - callback
   */
  static validateParam(req, res, next) {
    req.checkParams('partyId', 'The party ID must be an integer').notEmpty().isInt();
    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({
        status: 400,
        errors: helpers.extractErrors(errors),
      });
    }
    return next();
  }


  /**
 *
 * Check if a party already exists
 * @static
 * @param {object} req - request
 * @param {object} res - response
 * @param {object} next - callback
 * @returns
 * @memberof PartyValidator
 */
  static async partyExists(req, res, next) {
    const client = await pool.connect();
    let party;
    try {
      const sqlQuery = 'SELECT * FROM parties WHERE id = $1';
      const values = [req.params.partyId];
      party = await client.query({ text: sqlQuery, values });
      if (party.rowCount === 0) {
        return res.status(404).json({
          status: 404,
          error: 'The party does not exist',
        });
      }
    } catch (err) {
      return res.status(500).json({ status: 500, message: 'Internal server error' });
    } finally {
      await client.release();
    }
    return next();
  }
}

export default PartyValidator;
