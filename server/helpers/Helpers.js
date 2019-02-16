/* istanbul ignore file */
import Datauri from 'datauri';
import path from 'path';
import uploader from '../config/cloudinaryConfig';

const dUri = new Datauri();
const dataUri = req => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);
class Helpers {
  static extractErrors(errors) {
    const validationErrors = [];
    errors.map(error => validationErrors.push(error.msg));
    return validationErrors;
  }

  static isANumber(num) {
    return Number.isInteger(Number(num));
  }

  static uploadImage(req) {
    let response;
    if (req.file) {
      const file = dataUri(req).content;
      response = uploader.upload(file).then(result => result.secure_url).catch((err) => {
        if (err) {
          return false;
        }
      });
      return response;
    } return false;
  }
}

export default Helpers;
