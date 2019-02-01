import OfficeModel from '../models/OfficeModel';

class OfficeValidator {
  static readOfficeValidator(req, res, next) {
    const { officeId } = req.params;
    const officeIndex = OfficeModel.findIndex(office => office.id === Number(officeId));
    if (officeIndex < 0) {
      return res.status(404).json({
        status: 404,
        error: 'Office Not Found',
      });
    }
    req.body.officeIndex = officeIndex;
    return next();
  }

  static createOfficeValidator(req, res, next) {
    req.check('name')
      .trim()
      .isLength({ min: 1 })
      .withMessage('The political office name is required');
    req.check('type')
      .trim()
      .isLength({ min: 1 })
      .withMessage('The political office type is required');
    const errors = req.validationErrors();

    const validationErrors = [];

    if (errors) {
      errors.map(error => validationErrors.push(error.msg));
      return res.status(400).json({
        status: 400,
        errors: validationErrors,
      });
    }
    const officeExists = OfficeModel.find(office => (
      office.name.toLowerCase() === req.body.name.toLowerCase()
    ));
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
