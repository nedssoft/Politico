import Helpers from '../helpers/Helpers';
import pool from '../config/connection';


const { extractErrors } = Helpers;


class ApplicationValidator {
  static validateApplication(req, res, next) {
    req.checkBody('office', 'The aspirant\'s office is required').notEmpty().trim()
      .isNumeric()
      .withMessage('The office must be a number');
    req.checkBody('party', 'The aspirant\'s party is required').notEmpty().trim()
      .isNumeric()
      .withMessage('The party must be a number');
    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({
        status: 400,
        errors: extractErrors(errors),
      });
    }
    /* istanbul ignore next */
    next();
  }

  static async isDuplicateApplication(req, res, next) {
    const { id } = req.body.token;
    const { office } = req.body;
    const client = await pool.connect();
    const sqlQuery = { text: 'SELECT * FROM applications WHERE applicant = $1 AND office = $2', values: [id, office] };

    try {
      const applicant = await client.query(sqlQuery);
      if (applicant.rowCount) {
        res.status(409).json({ status: 409, error: 'You already applied for this office' });
      } else {
        req.body.applicant = id;
        next();
      }
    } catch (err) { return res.status(500).json({ status: 500, error: 'Internal server error' }); } finally { await client.release(); }
  }
}
export default ApplicationValidator;
