import { singleUser } from "../utils/usersMapper.js";
import * as UserService from "../services/UsersService.js";

export const login = async (req, res) => {
  const token = await UserService.signIn(req.body);
  return res.status(200).json({
    meta: {
      message: "User logged in successfully",
    },
    data: {
      token,
    },
  });
};

export const register = async (req, res, next) => {
  const user = await UserService.signUp(req.body);
  const userResource = singleUser(user, "User created successfully");
  return res.status(201).json(userResource);
};

export const profile = async (req, res) => {
  const user = await UserService.getProfile(req.user);
  const userResource = singleUser(user, "User profile retrieved successfully");
  return res.status(200).json(userResource);
};

export const activate = async (req, res, next) => {
  const activateUser = await UserService.activateUserAccount(req.params.token);
  if (!activateUser) {
    return res
      .status(400)
      .json({ meta: { message: "User already activated" } });
  }
  return res
    .status(200)
    .json({ meta: { message: "User activated successfully" } });
};
