import pool from '../config/connection';
/**
 * Defines Admin actions
 *
 * @class AdminController
 */
class AdminController {
  /**
   *
   * Registers the aspirant for a political office
   * @static
   * @param {object} req - request
   * @param {object} res - response
   * @param {object} next - callback
   * @returns
   * @memberof AdminController
   */
  static async registerCandidate(req, res) {
    const client = await pool.connect();
    let aspirant;
    try {
      const { office, userId } = req.body;
      const sqlQuery = `INSERT INTO candidates(office, candidate)
                    VALUES($1,$2) RETURNING *`;
      const values = [office, userId];
      aspirant = await client.query({ text: sqlQuery, values });
      if (aspirant.rows && aspirant.rowCount) {
        aspirant = aspirant.rows[0];
        return res.status(201).json({
          status: 201, data: { office: aspirant.office, user: aspirant.candidate },
        });
      }
      return res.status(500).json({ status: 500, error: 'Internal server error' });
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Internal server errorr' });
    } finally {
      await client.release();
    }
  }

  static async vote(req, res) {
    const client = await pool.connect();
    let vote;
    try {
      const { office, candidate, voter } = req.body;
      const sqlQuery = `INSERT INTO votes(office, candidate, voter)
                    VALUES($1, $2, $3) RETURNING *`;
      const values = [office, candidate, voter];
      vote = await client.query({ text: sqlQuery, values });
      if (vote.rows && vote.rowCount) {
        vote = vote.rows[0];
        return res.status(201).json({
          status: 201,
          data: {
            office: vote.office,
            candiadte: vote.candidate,
            voter: vote.voter,
            message: 'congratulations!!!, you have successfully voted' },
        });
      }
      return res.status(500).json({ status: 500, error: 'Internal server error' });
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Internal server errorr' });
    } finally {
      await client.release();
    }
  }
}
export default AdminController;
