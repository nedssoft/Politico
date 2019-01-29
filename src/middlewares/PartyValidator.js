class PartyValidator {
  static createPartyValidator(req, res, next) {
    req.check('name', 'The party name is required').notEmpty();
    req.check('hqAddress', 'The party Address is required').notEmpty();
    req.check('logoUrl', 'The party logo is required').notEmpty();
    const errors = req.validationErrors();

    const validationErrors = [];

    if (errors) {
      errors.map(error => validationErrors.push(error.msg));
      return res.status(422).json({
        status: 422,
        errors: validationErrors,
      });
    }
    const { name, hqAddress, logoUrl } = req.body;
    req.body.name = name.trim();
    req.body.hqAddress = hqAddress.trim();
    req.logoUrl = logoUrl.trim();
    next();
  }
}

export default PartyValidator;
