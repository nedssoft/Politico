
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

  static async getAllOffices(req, res) {
    const sqlQuery = 'SELECT * FROM offices';
    const client = await pool.connect();
    try {
      const offices = await client.query(sqlQuery);
      if (offices.rowCount) {
        return res.status(200).json({
          status: 200,
          data: [offices.rows],
        });
      }
      return res.status(200).json({ status: 200, data: [] });
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Internal Server error' });
    } finally {
      await client.release();
    }
  }

  static async findOffice(req, res) {
    const { officeId } = req.params;
    const client = await pool.connect();
    let party;
    try {
      const sqlQuery = 'SELECT * FROM offices WHERE id = $1 LIMIT 1';
      const values = [officeId];
      party = await client.query({ text: sqlQuery, values });
      if (party.rowCount) {
        res.status(200).json({
          status: 200,
          data: party.rows[0],
        });
      } else {
        return res.status(404).json({
          status: 404,
          error: `Office with ID: ${officeId} Not Found`,
        });
      }
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Internal server error' });
    } finally {
      await client.release();
    }
  }
}

export default OfficeController;
