
import OfficeModel from '../../models/dummyModels/OfficeModel';

class OfficeController {
  static createOffice(req, res) {
    const { name, type } = req.body;
    const id = OfficeModel.length + 1;
    const newOffice = {
      id,
      name,
      type,
    };
    OfficeModel.push(newOffice);
    return res.status(201).json({
      status: 201,
      data: [newOffice],
    });
  }

  static getOffice(req, res) {
    const { officeIndex } = req.body;
    return res.status(200).json({
      status: 200,
      data: [OfficeModel[officeIndex]],
    });
  }

  static all(req, res) {
    return res.status(200).json({
      status: 200,
      message: 'success',
      data: OfficeModel,
    });
  }
}

export default OfficeController;
