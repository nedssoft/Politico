
import OfficeModel from '../models/OfficeModel';

class OfficeController {
  static createOffice(req, res) {
    const { name, type } = req.body;
    const id = OfficeModel.length + 1;
    const newOffice = {
      id,
      name,
      type,
    };
    try {
      OfficeModel.push(newOffice);
      return res.status(201).json({
        status: 201,
        data: [newOffice],
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: err,
      });
    }
  }

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

  static all(req, res) {
    try {
      return res.status(200).json({
        status: 200,
        message: 'success',
        data: OfficeModel,
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: 'Unable to fetch political offices from the server',
      });
    }
  }
}

export default OfficeController;
