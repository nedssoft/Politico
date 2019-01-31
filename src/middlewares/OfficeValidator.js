
import OfficeModel from '../models/OfficeModel';

class OfficeValidator {
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
      return res.status(422).json({
        status: 422,
        errors: validationErrors,
      });
    }
    const officeExists = OfficeModel.find(office => (
      office.name.toLowerCase() === req.body.name.toLowerCase()
    ));
    if (officeExists) {
      return res.status(400).json({
        status: 400,
        error: 'The political office already exists',
      });
    }

    return next();
  }
}

export default OfficeValidator;
