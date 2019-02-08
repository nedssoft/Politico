

import pool from '../config/connection';


/**
 *Defines the actions for Party Endpoints
 *@class PartyController
 */
class PartyController {
  /**
   *
   * @param {object} req - request
   * @param {object} res - response
   */
  static async createParty(req, res) {
    const client = await pool.connect();
    let party;
    try {
      const { name, hqAddress, logoUrl } = req.body;
      const sqlQuery = `INSERT INTO parties(name, hqAddress, logoUrl)
                    VALUES($1,$2,$3) RETURNING id, name`;
      const values = [name, hqAddress, logoUrl];
      party = await client.query({ text: sqlQuery, values });
      if (party.rows && party.rowCount) {
        party = party.rows;
        return res.status(201).json({
          status: 201,
          data: party[0],
          message: 'Party created successfully',
        });
      }

      return res.status(500).json({ error: true, message: 'Internal server error' });
    } catch (err) {
      return res.status(500).json({ error: true, message: 'Internal server error' });
    } finally {
      await client.release();
    }
  }

  /**
   * Get a single party record
   * @static
   * @param {object} req - request
   * @param {object} res - response
   */
  static async getAParty(req, res) {
    const { partyId } = req.params;
    const client = await pool.connect();
    let party;
    try {
      const sqlQuery = 'SELECT * FROM parties WHERE id = $1 LIMIT 1';
      const values = [partyId];
      party = await client.query({ text: sqlQuery, values });
      if (party.rowCount) {
        res.status(200).json({
          status: 200,
          data: party.rows[0],
        });
      } else {
        return res.status(404).json({
          status: 404,
          error: `Party with ID: ${partyId} Not Found`,
        });
      }
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Internal server error' });
    } finally {
      await client.release();
    }
  }

  /**
   *Retrieves all parties record
   * @static
   * @param {object} req - request
   * @param {object} res - response
   */
  static async allParties(req, res) {
    const queryText = 'SELECT * FROM parties';
    const client = await pool.connect();
    try {
      const parties = await client.query(queryText);
      if (parties.rowCount) {
        return res.status(200).json({
          status: 200,
          data: parties.rows,
        });
      }
      return res.status(200).json({ status: 200, data: [] });
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Internal Server error' });
    } finally {
      await client.release();
    }
  }

  /**
 *@description Deletes a party record
 * @param {object} req - request
 * @param {object} res - response
 */
  static async deleteParty(req, res) {
    const { partyId } = req.params;
    const sqlQuery = { text: 'DELETE FROM parties WHERE id = $1 RETURNING id', values: [partyId] };
    const client = await pool.connect();
    try {
      const party = await client.query(sqlQuery);
      if (party.rowCount) {
        return res.status(200).json({
          status: 200,
          data: [{ message: 'Party deleted successfully' }],
        });
      }
      return res.status(500).json({ status: 500, message: 'Unable to delete the party' });
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Internal Server error' });
    } finally {
      await client.release();
    }
  }

  static async editParty(req, res) {
    const { partyId } = req.params;
    const { name } = req.body;
    const sqlQuery = { text: 'UPDATE parties SET name = $1 WHERE id = $2 RETURNING name',
      values: [name, partyId] };
    const client = await pool.connect();
    try {
      const party = await client.query(sqlQuery);
      if (party.rowCount) {
        return res.status(200).json({
          status: 200,
          data: [{ name }],
          message: 'Party updated successfully',
        });
      }
      return res.status(500).json({ status: 500, message: 'Unable to delete the party' });
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Internal Server error' });
    } finally {
      await client.release();
    }
  }
}

export default PartyController;
