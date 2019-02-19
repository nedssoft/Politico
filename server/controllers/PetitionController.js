import pool from '../config/connection';

class PetitionController {
  static async createPetition(req, res) {
    const App = PetitionController;
    const { office, body } = req.body;
    const { id } = req.body.token;
    const evidence = App.resolveEvidence(req);
    const sqlQuery = `INSERT INTO petitions(office, createdBy, body, evidence)
        VALUES($1, $2, $3, $4) RETURNING *`;
    const values = [office, id, body, evidence];
    const client = await pool.connect();
    let petition;
    try {
      petition = await client.query({ text: sqlQuery, values });
      if (petition.rowCount) {
        return res.status(201).json({ status: 201, data: petition.rows[0], message: 'Petition submitted' });
      }
      return res.status(500).json({ status: 500, message: 'Internal server error' });
    } catch (err) {
      return res.status(500).json({ status: 500, message: 'Internal server error' });
    } finally { await client.release(); }
  }

  static resolveEvidence(req) {
    const { imageUrl, videoUrl } = req.body;
    let evidence = '{}';
    if (imageUrl && videoUrl) {
    /* istanbul ignore next */
      evidence = `{${imageUrl}, ${videoUrl}}`;
    } if (!imageUrl && videoUrl) {
    /* istanbul ignore next */
      evidence = `{${videoUrl}}`;
    }
    if (!videoUrl && imageUrl) {
    /* istanbul ignore next */
      evidence = `{${imageUrl}}`;
    }
    return evidence;
  }

  static async getAllPetitions(req, res) {
    const sqlQuery = 'SELECT * FROM petitions';
    const client = await pool.connect();
    try {
      const petitions = await client.query(sqlQuery);
      if (petitions.rowCount) {
        return res.status(200).json({ status: 200, data: petitions.rows, message: 'OK' });
      }
      return res.status(200).json({ status: 200, data: [], message: 'No record found' });
    } catch (err) {
      return res.status(500).json({ status: 500, message: 'Internal server error' });
    } finally { await client.release(); }
  }
}
export default PetitionController;
