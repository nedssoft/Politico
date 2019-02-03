
import PartyModel from '../models/dummyModels/PartyModel';
import helpers from '../helpers/Helpers';

class PartyValidator {
  static createPartyValidator(req, res, next) {
    req.check('name', 'The party name is required')
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage('The party name must be at leat 3 characters long')
      .not()
      .isNumeric()
      .withMessage('The party name cannot be a number');
    req.check('hqAddress', 'The party HQ Address is required').notEmpty();
    req.check('logoUrl', 'The party logo is required').notEmpty()
      .isLength({ min: 3 })
      .withMessage('The party logo Url must be at leat 3 characters long');
    const errors = req.validationErrors();

    if (errors) {
      return res.status(400).json({
        status: 400,
        errors: helpers.extractErrors(errors),
      });
    }
    // const partyExists = PartyModel.find(party => (
    //   party.name.toLowerCase() === req.body.name.toLowerCase()
    // ));
    const partyExists = helpers.recordExists(PartyModel, req);
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
    if (!helpers.isNumber(partyId)) {
      return res.status(400).json({
        status: 400,
        error: `Party ID: ${partyId} must be an integer`,
      });
    }
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
    if (!helpers.isNumber(partyId)) {
      return res.status(400).json({
        status: 400,
        error: `Party ID: ${partyId} must be an integer`,
      });
    }
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
