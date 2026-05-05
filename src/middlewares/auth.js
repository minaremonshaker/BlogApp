
import UnAuthorized from "../errors/AuthenticationError.js";
import jwt from "jsonwebtoken";
import User from "../models/Users.js";
import asyncHandler from "../utils/asyncHandler.js"
import notFound from '../errors/NotFound.js'

const auth = asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) throw UnAuthorized("Unauthorized");
    const token = authorization.split(" ")[1]
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    if(!user) throw notFound("User not found");
    req.user = user;
    next();
});

export default auth;