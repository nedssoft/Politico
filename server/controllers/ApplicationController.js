
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

  /**
   *Retrieves all applications record
   * @static
   * @param {object} req - request
   * @param {object} res - response
   */
  static async getAllApplications(req, res) {
    const sqlQuery = `SELECT applications.id, applications.status, users.firstname as firstname,
    users.lastname as lastname,parties.name as partyname, parties.logourl as partylogo, offices.name as officename,
    offices.type as officetype, applications.createdon FROM applications
    JOIN users ON users.id = applications.applicant
    JOIN parties ON parties.id = applications.party
    JOIN offices ON offices.id = applications.office
    ORDER BY applications.createdon DESC`;
    const client = await pool.connect();
    try {
      const applications = await client.query(sqlQuery);
      if (applications.rowCount) {
        return res.status(200).json({
          status: 200,
          data: applications.rows,
          message: 'OK',
        });
      }
      return res.status(200).json({ status: 200, data: [], message: 'No applications Found' });
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Internal Server error' });
    } finally {
      await client.release();
    }
  }

  /**
 *@description Deletes an application record
 * @param {object} req - request
 * @param {object} res - response
 */
  static async deleteApplication(req, res) {
    const { applicationId } = req.params;
    const sqlQuery = { text: 'DELETE FROM applications WHERE id = $1 RETURNING id', values: [applicationId] };
    const client = await pool.connect();
    try {
      const party = await client.query(sqlQuery);
      if (party.rowCount) {
        return res.status(200).json({
          status: 200,
          data: { message: 'Application deleted successfully' },
        });
      }
      return res.status(500).json({ status: 500, message: 'Unable to delete the application' });
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Internal Server error' });
    } finally {
      await client.release();
    }
  }

  static async aspirantIsFlagBearer(applicantId, officeId) {
    const client = await pool.connect();
    try {
      const sqlQuery = { text: 'SELECT * FROM candidates WHERE office = $1 AND candidate = $2',
        values: [officeId, applicantId] };
      const candidateExists = await client.query(sqlQuery);
      if (candidateExists.rowCount !== 0) {
        return true;
      } return false;
    } catch (err) {
      return true;
    } finally {
      await client.release();
    }
  }

  static async partyHasFlagBearer(partyId, officeId) {
    const client = await pool.connect();
    try {
      const sqlQuery = { text: 'SELECT * FROM candidates WHERE office = $1 AND party = $2',
        values: [officeId, partyId] };
      const candidateExists = await client.query(sqlQuery);
      if (candidateExists.rowCount !== 0) {
        return true;
      } return false;
    } catch (err) {
      return true;
    } finally {
      await client.release();
    }
  }

  static async registerCandidate(partyId, officeId, applicantId) {
    let aspirant;
    const client = await pool.connect();
    try {
      const sqlQuery = `INSERT INTO candidates(office, candidate, party)
                    VALUES($1,$2, $3) RETURNING *`;
      const values = [officeId, applicantId, partyId];
      aspirant = await client.query({ text: sqlQuery, values });
      if (aspirant.rows && aspirant.rowCount) {
        return true;
      }
      return false;
    } catch (err) {
      return true;
    } finally {
      await client.release();
    }
  }

  static async getApplication(applicationId) {
    const client = await pool.connect();
    let application;
    try {
      const sqlQuery = 'SELECT * FROM applications WHERE id = $1 ORDER BY createdon DESC LIMIT 1';
      const values = [applicationId];
      application = await client.query({ text: sqlQuery, values });
      if (application.rowCount) {
        return application.rows[0];
      }
      return {};
    } catch (err) {
      return;
    } finally {
      await client.release();
    }
  }

  static async updateApplication(applicationId, status, res) {
    const sqlQuery = { text: 'UPDATE applications SET status = $1 WHERE id = $2 RETURNING id, status',
      values: [status, applicationId] };
    const client = await pool.connect();
    try {
      const application = await client.query(sqlQuery);
      if (application.rowCount) {
        return res.status(200).json({
          status: 200,
          data: application.rows[0],
          message: `Application ${status} successfully`,
        });
      }
      return res.status(500).json({ status: 500, message: 'Unable to update the application' });
    } catch (err) {
      return res.status(500).json({ status: 500, error: 'Internal Server error' });
    } finally {
      await client.release();
    }
  }

  static async deleteCandidate(applicant, office) {
    const sqlQuery = { text: 'DELETE FROM candidates WHERE candidate = $1 AND office = $2 RETURNING id',
      values: [applicant, office] };
    const client = await pool.connect();
    try {
      const party = await client.query(sqlQuery);
      if (party.rowCount) {
        return true;
      }
      return false;
    } catch (err) {
      return;
    } finally {
      await client.release();
    }
  }

  static async editApplication(req, res) {
    const App = ApplicationController;
    const { applicationId } = req.params;
    const { status } = req.body;
    if (status === 'approved') {
      const { applicant, office, party } = await App.getApplication(applicationId);
      const aspirantIsFlagBearer = await App.aspirantIsFlagBearer(applicant, office);
      const partyHasFlagBearer = await App.partyHasFlagBearer(applicant, party);
      if (!aspirantIsFlagBearer && !partyHasFlagBearer) {
        const registerCandidate = await App.registerCandidate(party, office, applicant);
        if (!registerCandidate) {
          return res.status(500).json({ status: 500, message: 'Unable to update the application' });
        }
      } else {
        return res.status(409).json({ status: 409,
          message: 'Either the user is alredy a flag bearer for this office or the Party already has a candidate for ApplicationController office' });
      }
    } else if (status === 'revoked') {
      const { applicant, office } = await App.getApplication(applicationId);
      const deleteCandidate = await App.deleteCandidate(applicant, office);
      if (!deleteCandidate) {
        return res.status(500).json({ status: 500, message: 'Unable to update the application' });
      }
    }
    App.updateApplication(applicationId, status, res);
  }
}
export default ApplicationController;
