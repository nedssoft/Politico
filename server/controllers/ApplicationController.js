import pool from '../config/connection';

class ApplicationController {
  static async createApplication(req, res) {
    const { office, party, applicant } = req.body;
    const client = await pool.connect();
    const sqlQuery = {
      text: 'INSERT INTO applications(party, office, applicant) VALUES($1, $2, $3) RETURNING *',
      values: [party, office, applicant],
    };
    try {
      const application = await client.query(sqlQuery);
      if (application.rowCount) {
        return res.status(201).json({ status: 201, data: application.rows[0], message: 'Application submitted' });
      }
      return res.status(500).json({ status: 500, error: 'Internal server error' });
    } catch (err) { return res.status(500).json({ status: 500, error: 'Internal server error' }); } finally { await client.release(); }
  }
}
export default ApplicationController;
