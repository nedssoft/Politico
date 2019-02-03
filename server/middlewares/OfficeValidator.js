import OfficeModel from '../models/dummyModels/OfficeModel';
import helpers from '../helpers/Helpers';

class OfficeValidator {
  static readOfficeValidator(req, res, next) {
    const { officeId } = req.params;
    if (!helpers.isNumber(officeId)) {
      return res.status(400).json({
        status: 400,
        error: `Office with ID: ${officeId} must be an integer`,
      });
    }
    const officeIndex = OfficeModel.findIndex(office => office.id === Number(officeId));
    if (officeIndex < 0) {
      return res.status(404).json({
        status: 404,
        error: `Office with ID: ${officeId} Not Found`,
      });
    }
    req.body.officeIndex = officeIndex;
    return next();
  }

  static createOfficeValidator(req, res, next) {
    req.check('name', 'The political office name is required')
      .notEmpty()
      .trim()
      .isLength({ min: 3 })
      .withMessage('The office name must be at leat 3 characters long')
      .not()
      .isNumeric()
      .withMessage('The office name cannot be a number');

    req.check('type', 'The political office type is required')
      .notEmpty()
      .trim()
      .isLength({ min: 3 })
      .withMessage('The political office type must be at least 3 characters long')
      .not()
      .isNumeric()
      .withMessage('The political office type cannot be a number');

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({
        status: 400,
        errors: helpers.extractErrors(errors),
      });
    }
    // const officeExists = OfficeModel.find(office => (
    //   office.name.toLowerCase() === req.body.name.toLowerCase()
    // ));
    const officeExists = helpers.recordExists(OfficeModel, req);
    if (officeExists) {
      return res.status(409).json({
        status: 409,
        error: 'The political office already exists',
      });
    }

    return next();
  }
}

export default OfficeValidator;
