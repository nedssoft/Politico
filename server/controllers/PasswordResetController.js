/* istanbul ignore file */
import passwordHash from 'password-hash';
import helpers from '../helpers/Helpers';
import pool from '../config/connection';
import Mailer from '../helpers/Mailer';
import Authenticator from '../helpers/Authenticator';

const { sendMail } = Mailer;
const { generateToken, verifyToken } = Authenticator;
class PasswordResetController {
  static async passwordReset(req, res) {
    try {
      const { email } = req.body;
      const token = await generateToken({ email });
      const url = `${req.protocol}://${req.get('host')}/password/reset/${token}`;
      const message = helpers.template(url);
      const subject = 'Password Reset';
      const { accepted } = await sendMail({ to: email, subject, html: message });
      if (accepted[0] === email) {
        return res.status(200).json({ status: 200, message: 'Check your mail for password reset link', email });
      }
    } catch (err) { return res.status(500).json({ status: 500, err }); }
  }

  static resetPasswordForm(req, res) {
    const { token } = req.params;
    try {
      const { email } = verifyToken(token);
      if (!email) {
        res.send(helpers.errorTemplate('Invalid token'));
      }
      res.send(helpers.resetTemplate(email));
    } catch (err) {
      res.send(helpers.errorTemplate('Invalid token'));
    }
  }

  static async resetPassword(req, res) {
    const { email, password, passwordConfirmation } = req.body;
    if (!password || password.length < 6) {
      res.send(helpers.resetTemplate(email, '<div class="alert">Password is must be at least 6 characters long</div>'));
    } else if (password !== passwordConfirmation) {
      res.send(helpers.resetTemplate(email, '<div class="alert">Password does not match!</div>'));
    } else {
      const hashedpassword = await passwordHash.generate(password);
      const sqlQuery = 'UPDATE users SET password = $1 WHERE email = $2';
      const values = [hashedpassword, email];
      const client = await pool.connect();
      try {
        const updated = await client.query({ text: sqlQuery, values });
        if (updated.rowCount) {
          const url = 'https://oriechinedu.github.io/Politico/UI/login.html';
          res.send(helpers.successTemplate('Password reset successfully', `<a href="${url}">Login</a>`));
        } else {
          res.send(helpers.resetTemplate(email, '<div class="alert">Unable to reset password, try again</div>'));
        }
      } catch (err) {
        console.log(err);
        res.send(helpers.resetTemplate(email, '<div class="alert">Unable to reset password, try again</div>'));
      } finally { await client.release(); }
    }
  }
}

export default PasswordResetController;
