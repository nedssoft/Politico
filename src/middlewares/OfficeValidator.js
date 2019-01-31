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
}

export default OfficeValidator;
