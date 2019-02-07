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

  static validateVote(req, res, next) {
    req.check('office', 'The aspirant\'s office is required')
      .notEmpty().trim()
      .isNumeric()
      .withMessage('The office must be a number');

    req.check('candidate', 'Select the candiadte to vote for')
      .notEmpty().trim()
      .isNumeric()
      .withMessage('The candidate ID must be a number');
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
    next();
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
    next();
  }

  /**
 *
 * Ensures that office ID is valid
 * @static
  * @param {object} req - request
 * @param {object} res - response
 * @param {object} next - callback
 * @returns
 * @memberof AdminValidator
 */
  static validateOfficeId(req, res, next) {
    const { officeId } = req.params;
    if (officeId && !Helpers.isANumber(officeId)) {
      return res.status(400).json({
        status: 400,
        error: 'The office ID must be a number',
      });
    }
    if (!officeId) {
      return res.status(400).json({
        status: 400,
        error: 'The office ID is required',
      });
    }
    req.body.office = officeId;
    next();
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

  /**
 *
 * Ensures user votes once for a given office
 * @static
 * @param {object} req - request
 * @param {object} res - response
 * @param {object} next - callback
 * @returns
 * @memberof AdminValidator
 */
  static async checkIfUserHasVoted(req, res, next) {
    const officeId = req.body.office;
    let voterId;
    const client = await pool.connect();
    try {
      const decodedToken = req.body.token;
      voterId = decodedToken.id;
      if (!voterId) {
        return res.status(401).json({ status: 401, error: 'Unauthorized voter, You must login to vote' });
      }
      const sqlQuery = { text: 'SELECT * FROM votes WHERE voter = $1 AND office = $2',
        values: [voterId, officeId] };
      const user = await client.query(sqlQuery);
      if (user.rowCount) {
        return res.status(409).json({ status: 409, error: 'you have already voted for this office' });
      }
    } catch (err) {
      return;
    } finally { await client.release(); }
    req.body.voter = voterId;
    next();
  }

  /**
 *
 * Ensures that candidate exists in the database
 * @static
 * @param {object} req - request
 * @param {object} res - response
 * @param {object} next - callback
 * @returns
 * @memberof AdminValidator
 */
  static async checkIfCandidateExists(req, res, next) {
    const { candidate } = req.body;
    const client = await pool.connect();
    try {
      const sqlQuery = { text: 'SELECT * FROM candidates WHERE id = $1', values: [candidate] };
      const candidateExists = await client.query(sqlQuery);
      if (candidateExists.rowCount === 0) {
        return res.status(404).json({
          status: 404,
          error: 'The candidate does not exist',
        });
      }
    } catch (err) {
      return;
    } finally {
      await client.release();
    }
    next();
  }
}
export default AdminValidator;
