import NotFound from "../errors/NotFound.js";
import User from "../models/Users.js";
import { singleUser, userCollectionMap } from "../utils/usersMapper.js";
import { getAllUsers, createUser } from "../services/UsersService.js";

export const index = async (req, res) => {
  const users = await getAllUsers(req.query);
  const usersCollection = userCollectionMap(users);
  return res.json(usersCollection);
};

export const show = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!user) return res.status(404).json({ message: "User not found" });
  const userResource = singleUser(user, "User found successfully");
  return res.json(userResource);
};

export const store = async (req, res) => {
  const user = await createUser(req.body);
  const userResource = singleUser(user, "User created successfully");
  return res.status(201).json(userResource);
};

export const update = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!user) throw NotFound("user not found");

  const updatedUserResource = singleUser(user, "User updated successfully");

  return res.json(updatedUserResource);
};

export const replace = async (req, res) => {
  const user = await User.findOneAndReplace({ _id: req.params.id }, req.body, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!user) throw NotFound("user not found");
  const replaceUserResource = singleUser(user, "User replaced successfully");
  return res.json(replaceUserResource);
};

export const destroy = async (req, res) => {
  const user = await User.findOneAndDelete({ _id: req.params.id });
  if (!user) throw NotFound("user not found");
  const deletedUserResource = singleUser([], "User deleted successfully");
  return res.json(deletedUserResource);
};
