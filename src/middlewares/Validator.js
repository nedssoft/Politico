
class Validator {
  static validateParty(req, res, next) {
    if (!req.body.name) {
      return res.status(400).json({
        status: 400,
        error: 'The name of the party cannot be empty',
      });
    }
    if (!req.body.hqAddress) {
      return res.status(400).json({
        status: 400,
        error: 'The HQ Address of the party cannot be empty',
      });
    }
    if (!req.body.logoUrl) {
      return res.status(400).json({
        status: 400,
        error: 'The Logo of the party cannot be empty',
      });
    }

    return next();
  }
}
export default Validator;
