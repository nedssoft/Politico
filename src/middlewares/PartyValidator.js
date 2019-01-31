import PartyModel from '../models/PartyModel';

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
    const partyExists = PartyModel.find(party => (
      party.name.toLowerCase() === req.body.name.toLowerCase()
    ));
    if (partyExists) {
      return res.status(400).json({
        status: 400,
        error: 'The party already exists',
      });
    }
    const { name, hqAddress, logoUrl } = req.body;
    req.body.name = name.trim();
    req.body.hqAddress = hqAddress.trim();
    req.logoUrl = logoUrl.trim();
    return next();
  }

  static editPartyValidator(req, res, next) {
    req.check('name', 'The new party name is required').notEmpty();
    const validationErrors = [];
    const errors = req.validationErrors();
    if (errors) {
      errors.map(error => validationErrors.push(error.msg));
      return res.status(422).json({
        status: 422,
        errors: validationErrors,
      });
    }
    const { partyId } = req.params;
    const partyIndex = PartyModel.findIndex(party => (
      party.id === Number(partyId)
    ));
    if (partyIndex < 0) {
      return res.status(404).json({
        status: 404,
        error: 'The party you want to edit does not exist',
      });
    }
    req.body.name = req.body.name.trim();
    req.body.partyIndex = partyIndex;
    return next();
  }
}

export default PartyValidator;
