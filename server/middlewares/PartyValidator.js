
import PartyModel from '../models/PartyModel';
import helpers from '../helpers/helpers';

class PartyValidator {
  static createPartyValidator(req, res, next) {
    req.check('name', 'The party name is required').notEmpty();
    req.check('hqAddress', 'The party HQ Address is required').notEmpty();
    req.check('logoUrl', 'The party logo is required').notEmpty();
    const errors = req.validationErrors();

    if (errors) {
      return res.status(400).json({
        status: 400,
        errors: helpers.extractErrors(errors),
      });
    }
    const partyExists = PartyModel.find(party => (
      party.name.toLowerCase() === req.body.name.toLowerCase()
    ));
    if (partyExists) {
      return res.status(409).json({
        status: 409,
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

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({
        status: 400,
        errors: helpers.extractErrors(errors),
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

  static deletePartyValidator(req, res, next) {
    const { partyId } = req.params;
    const partyIndex = PartyModel.findIndex(party => party.id === Number(partyId));
    if (partyIndex < 0) {
      return res.status(404).json({
        status: 404,
        error: `Party with ID: ${partyId} Not Found`,
      });
    }
    req.body.partyIndex = partyIndex;
    return next();
  }
}

export default PartyValidator;
