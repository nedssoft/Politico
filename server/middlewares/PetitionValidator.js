import Helpers from '../helpers/Helpers';
import pool from '../config/connection';

const { extractErrors } = Helpers;

class PetitionValidator {
  static validatePetition(req, res, next) {
    req.checkBody('body', 'The description of the petition is required').notEmpty().trim()
      .not()
      .isNumeric()
      .withMessage('The description of the petition must be a string');
    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({
        status: 400,
        errors: extractErrors(errors),
      });
    }
    const { body } = req.body;
    req.body.body = body.replace(/\s{2,}/g, ' ');
    return next();
  }

  static async isPolitician(req, res, next) {
    const { office } = req.body;
    const { id } = req.body.token;
    const client = await pool.connect();
    const sqlQuery = 'SELECT * FROM candidates WHERE office = $1 AND candidate = $2';
    const values = [office, id];
    let politician;

    try {
      politician = await client.query({ text: sqlQuery, values });
      if (!politician.rowCount) {
        return res.status(400).json({ status: 400, error: 'You must be contestant for office you want to submit petition for' });
      }
      return next();
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Internal server error' });
    } finally { await client.release(); }
  }
}
export default PetitionValidator;
