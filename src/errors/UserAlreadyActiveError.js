const UserAlreadyActive = (message) => {
  const error = new Error();
  error.name = "UserAlreadyActive";
  error.message = message
  return error;
};

export default UserAlreadyActive;
