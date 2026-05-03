const UnAuthorized = (message) => {
  const error = new Error();
  error.name = "UnAuthorized";
  error.message = message;
  return error;
};

export default UnAuthorized;
