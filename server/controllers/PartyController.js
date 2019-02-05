
import PartyModel from '../models/PartyModel';
<<<<<<< HEAD
import pool from '../config/connection';

const { createParty } = PartyModel;
=======

const { create, getParty } = PartyModel;
>>>>>>> 63c45d11fafa1b1a58ac055b90e728ba4c430354

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
    let party;
    try {
<<<<<<< HEAD
      party = await createParty(req, res);
=======
      party = await create(req, res);
>>>>>>> 63c45d11fafa1b1a58ac055b90e728ba4c430354
      if (party.rows && party.rowCount) {
        party = party.rows;
        return res.status(201).json({
          status: 201, data: party,
        });
      }
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Internal server error' });
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
<<<<<<< HEAD
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
      return res.status(500).json({ status: 500, errror: 'Internal server error' });
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
          data: [parties.rows[0]],
        });
      }
      return res.status(200).json({ status: 200, data: [] });
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Internal Server error' });
=======
    const party = await getParty(partyId);
    if (party) {
      res.status(200).json({
        status: 200,
        data: party,
      });
    } else {
      return res.status(404).json({
        status: 404,
        error: `Party with ID: ${partyId} Not Found`,
      });
>>>>>>> 63c45d11fafa1b1a58ac055b90e728ba4c430354
    }
  }
}

export default PartyController;
