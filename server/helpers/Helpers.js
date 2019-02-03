
class Helpers {
  static extractErrors(errors) {
    const validationErrors = [];
    errors.map(error => validationErrors.push(error.msg));
    return validationErrors;
  }

  static isNumber(num) {
    return Number.isInteger(Number(num));
  }

  static recordExists(Model, req) {
    return Model.find(m => m.name.toLowerCase() === req.body.name.toLowerCase());
  }
}

export default Helpers;
