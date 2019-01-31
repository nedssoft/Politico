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
        data: [{ newOffice }],
      });
    } catch (err) {
      return res.stattus(500).json({
        status: 500,
        error: err,
      });
    }
  }
}

export default OfficeController;
