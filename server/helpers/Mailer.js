/* istanbul ignore file */
import nodemailer from 'nodemailer';
import mailConfig from '../config/mailConfig';

class Mailer {
  static async sendMail(payload) {
    try {
      const from = payload.sender || 'ned@politico.com';
      const { to, subject, html } = payload;
      const mailOptions = { from, to, subject, html };
      const transporter = await nodemailer.createTransport(mailConfig);
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (err) {
      return err;
    }
  }
}
export default Mailer;
