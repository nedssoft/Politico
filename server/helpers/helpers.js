const extractErrors = (errors) => {
  const validationErrors = [];
  errors.map(error => validationErrors.push(error.msg));
  return validationErrors;
};

const helpers = {
  extractErrors,
};

export default helpers;
