
import PartyModel from '../models/PartyModel';

const { createParty, getParty } = PartyModel;

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

  /**
   * Get a single party record
   * @static
   * @param {object} req - request
   * @param {object} res - response
   */
  static async getAParty(req, res) {
    const { partyId } = req.params;
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
    }
  }
}

export default PartyController;
