
import PartyModel from '../models/PartyModel';

const { createParty } = PartyModel;

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
      party = await createParty(req, res);
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
}

export default PartyController;
