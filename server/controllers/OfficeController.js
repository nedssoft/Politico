
import pool from '../config/connection';
/**
 * @description Defines the actions for Office endpoints
 * @class OfficeController
 */
class OfficeController {
  /**
   *@description Creates new office record
   *@static
   * @param {object} req - request
   * @param {object} res - response
   */
  static async createOffice(req, res) {
    const client = await pool.connect();
    let office;
    try {
      const { name, type } = req.body;
      const sqlQuery = `INSERT INTO offices(name, type)
                    VALUES($1,$2) RETURNING *`;
      const values = [name, type];
      office = await client.query({ text: sqlQuery, values });
      if (office.rows && office.rowCount) {
        return res.status(201).json({
          status: 201, data: [office.rows[0]],
        });
      }
      return res.status(500).json({ error: true, message: 'Internal server error' });
    } catch (err) {
      return res.status(500).json({ error: true, message: 'Internal server errorr' });
    } finally {
      await client.release();
    }
  }
}

export default OfficeController;
