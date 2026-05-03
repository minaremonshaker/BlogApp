const pageNotFoundHandler = (req, res, next) => {
  return res.status(404).json({
    message: "Not found",
  });

};

export default pageNotFoundHandler;
