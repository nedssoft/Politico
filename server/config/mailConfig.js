/* istanbul ignore file */
const mailConfig = {
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: process.env.MAIL_PORT || 465,
  secure: process.env.MAIL_ENCRYPTION || true,
  auth: {
    user: process.env.MAIL_USERNAME || 'nedsoftng@gmail.com',
    pass: process.env.MAIL_PASSWORD || 'calculus2689',
  },
};

export default mailConfig;
