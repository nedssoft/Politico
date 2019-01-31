
import OfficeModel from '../models/OfficeModel';

class OfficeController {
  static getOffice(req, res) {
    const { officeIndex } = req.body;
    try {
      return res.status(200).json({
        status: 200,
        data: [OfficeModel[officeIndex]],
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: 'Unable to retrieve office from the server',
      });
    }
  }
}

export default OfficeController;
