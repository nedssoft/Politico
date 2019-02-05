import pool from '../config/connection';

/**
 * Defines the methods to interact with Party Model
 * @class PartyModel
 */
class PartyModel {
  /**
   * Creates new party record
   * @param {object} req - request
   * @param {object} res - response
   */
  static async createParty(req, res) {
    const client = await pool.connect();
    let party;
    try {
      const { name, hqAddress, logoUrl } = req.body;
      const text = `INSERT INTO parties(name, hqAddress, logoUrl)
                    VALUES($1,$2,$3) RETURNING id, name`;
      const values = [name, hqAddress, logoUrl];
      party = await client.query({ text, values });
      return party;
    } catch (err) {
      return res.status(500).json({ error: true, message: 'Internal server error, t' });
    } finally {
      await client.release();
    }
  }

  /**
   * Checks if the party already exists
   * @param {string} name of the party
   */
  static async partyExists(name) {
    const client = await pool.connect();
    let party;
    try {
      const text = 'SELECT * FROM parties WHERE name = $1 LIMIT 1';
      const values = [name];
      party = await client.query({ text, values });
      if (party.rowCount) {
        return party.rows[0];
      } return null;
    } catch (err) {
      return null;
    }
  }

  static async getParty(partyId) {
    const client = await pool.connect();
    let party;
    try {
      const text = 'SELECT * FROM parties WHERE id = $1 LIMIT 1';
      const values = [partyId];
      party = await client.query({ text, values });
      if (party.rowCount) {
        return party.rows[0];
      } return null;
    } catch (err) {
      return null;
    }
  }
}
export default PartyModel;
