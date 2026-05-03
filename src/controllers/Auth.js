import { compareSync } from "bcrypt";
import crypto from "crypto-js";
import jwt from "jsonwebtoken";

import UnAuthorized from "../errors/AuthenticationError.js";
import NotFound from "../errors/NotFound.js";
import User from "../models/Users.js";
import { createUser } from "../services/UsersService.js";
import { singleUser } from "../utils/usersMapper.js";
import MailEmmiters from "../emails/MailEmitters.js";

/**
 * Handles user login requests.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw UnAuthorized("Email and password are required");
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw NotFound("User not found");
    const passwordMatch = compareSync(password, user.password);
    if (!passwordMatch) throw UnAuthorized("Invalid Credintails");
    if (!user.isActive) {
      return res.status(401).json({
        meta: {
          message: "Account pending email verification",
        },
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return res.status(200).json({
      meta: {
        message: "User logged in successfully",
      },
      data: {
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Handles user login requests.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 */
export const register = async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    const userResource = singleUser(user, "User created successfully");
    const ActivationToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
    );
    const ActivationLink = `${process.env.APP_URL}:${process.env.PORT}/auth/activate/${ActivationToken}`;
    MailEmmiters.emit("register", user, "Welcome to BlogApp");
    MailEmmiters.emit(
      "activate",
      user,
      "Activate your account",
      ActivationLink,
    );
    return res.status(201).json(userResource);
  } catch (err) {
    next(err);
  }
};

/**
 * Handles user profile requests.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {Promise<void>} The promise that resolves when the operation is complete.
 */
export const profile = async (req, res, next) => {
  try {
    const user = req.user;
    user.phoneNumber = crypto.AES.decrypt(
      user.phoneNumber,
      process.env.ENCRYPTION_KEY,
    ).toString(crypto.enc.Utf8);
    if (!user) throw NotFound("User not found");
    const userResource = singleUser(
      user,
      "User profile retrieved successfully",
    );
    return res.status(200).json(userResource);
  } catch (err) {
    next(err);
  }
};

export const activate = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: email });
    if (!user) throw NotFound("User not found");
    user.isActive = true;
    await user.save({ validateModifiedOnly: true });
    return res.status(200).json({ message: "User activated successfully" });
  } catch (err) {
    next(err);
  }
};
