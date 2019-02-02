const extractErrors = (errors) => {
  const validationErrors = [];
  errors.map(error => validationErrors.push(error.msg));
  return validationErrors;
};

const isNumber = num => Number.isInteger(Number(num));

const recordExists = (Model, req) => Model.find(m => (
  m.name.toLowerCase() === req.body.name.toLowerCase()
));

const helpers = {
  extractErrors,
  isNumber,
  recordExists,
};

export default helpers;
