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
  static createPartyValidator(req, res, next) {
    req.check('name', 'The party name is required')
      .notEmpty().trim()
      .isLength({ min: 3 })
      .withMessage('The party name must be at leat 3 characters long')
      .not()
      .isNumeric()
      .withMessage('The party name cannot be a number');
    req.check('hqAddress', 'The party HQ Address is required').notEmpty().trim()
      .not()
      .isNumeric()
      .withMessage('The hqAddress name must be a string');
    req.check('logoUrl', 'The party logo is required').notEmpty().trim()
      .isLength({ min: 3 })
      .withMessage('The party logo Url must be at leat 3 characters long');
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
      console.log(err);
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
    const { partyId } = req.params;
    if (!helpers.isANumber(partyId) || !partyId) {
      return res.status(400).json({
        status: 400,
        error: 'The party ID must be a number',
      });
    }
    return next();
  }

  /**
 * Validates the input for editing a party
 *
 * @static
 * @param {object} req - request
 * @param {object} res - response
 * @param {object} next - callback
 * @returns
 * @memberof PartyValidator
 */
  static editPartyValidator(req, res, next) {
    req.check('name', 'The party name is required')
      .notEmpty().trim()
      .isLength({ min: 3 })
      .withMessage('The party name must be at leat 3 characters long')
      .not()
      .isNumeric()
      .withMessage('The party name cannot be a number');

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
      console.log(err);
    } finally {
      await client.release();
    }
    return next();
  }
}

export default PartyValidator;
