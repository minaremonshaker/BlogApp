import NotFound from "../errors/NotFound.js";
import User from "../models/Users.js";
import { singleUser, userCollectionMap } from "../utils/usersMapper.js";
import { getAllUsers, createUser } from "../services/UsersService.js";


/**
 * Retrieves all users from the database, excluding the password field.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A Promise that resolves or rejects when the operation is complete.
 */
export const index = async (req, res, next) => {
  try {
    const users = await getAllUsers(req.query);
    const usersCollection = userCollectionMap(users);
    return res.json(usersCollection);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a single user by ID from the database.
 * The password field is excluded from the result.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A Promise that resolves or rejects when the operation is complete.
 */
export const show = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Stores a new user in the database.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A Promise that resolves or rejects when the operation is complete.
 */
export const store = async (req, res, next) => {
  try {
    const user = await createUser(req.body)
    const userResource = singleUser(user, "User created successfully");
    return res.status(201).json(userResource);
  } catch (error) {
    next(error);
  }
};

/**
 * Updates a user in the database.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A Promise that resolves or rejects when the operation is complete.
 */
export const update = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!user) throw NotFound("user not found");

    return res.json({
      type: "User",
      attributes: user,
      message: "User updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Replaces a user in the database.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A Promise that resolves or rejects when the operation is complete.
 */
export const replace = async (req, res, next) => {
  try {
    const user = await User.findOneAndReplace(
      { _id: req.params.id },
      req.body,
      { returnDocument: "after", runValidators: true },
    );
    if (!user) throw NotFound("user not found");
    return res.json({
      type: "User",
      data: user,
      message: "user replaced successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a user from the database.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>} - A Promise that resolves or rejects when the operation is complete.
 */

export const destroy = async (req, res, next) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id });
    if (!user) throw NotFound("user not found");
    return res.json({
      type: "User",
      data: [],
      message: "user deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
