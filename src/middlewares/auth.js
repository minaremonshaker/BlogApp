
import UnAuthorized from "../errors/AuthenticationError.js";
import jwt from "jsonwebtoken";
import User from "../models/Users.js";

const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) throw UnAuthorized("Unauthorized");
    const token = authorization.split(" ")[1]
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export default auth;