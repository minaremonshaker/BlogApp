import { compareSync } from "bcrypt";
import crypto from "crypto-js";
import jwt from "jsonwebtoken";
import MailEmmiters from "../emails/MailEmitters.js";
import UserAlreadyActive from "../errors/UserAlreadyActiveError.js";
import UnAuthorized from "../errors/AuthenticationError.js";
import NotFound from "../errors/NotFound.js";
import User, {
  allowedAddressSearchFeilds,
  allowedUserSearchFeilds,
} from "../models/Users.js";
import { removeTrailingCommaAndSplit } from "../utils/stringHelpers.js";

export const getAllUsers = (query) => {
  const { term, searchBy, sort, page, limit, project } = query;
  const user = User.aggregate();
  if (term && !searchBy) {
    const userMap = allowedUserSearchFeilds.map((feild) => {
      return { [feild]: { $regex: term, $options: "i" } };
    });

    const addressMap = allowedAddressSearchFeilds.map((feild) => {
      return { [`addresses.${feild}`]: { $regex: term, $options: "i" } };
    });

    user.match({
      $or: [...userMap, ...addressMap],
    });
  }

  if (term && searchBy) {
    const search_by = removeTrailingCommaAndSplit(searchBy);

    const userMap = search_by.map((field) => {
      if (
        !allowedUserSearchFeilds.includes(field) &&
        !allowedAddressSearchFeilds.includes(field)
      )
        throw new Error(`${field} is not allowed for searchBy`);

      let queryObject = {};

      queryObject = {
        [field]: { $regex: term, $options: "i" },
      };

      if (allowedAddressSearchFeilds.includes(field)) {
        queryObject = {
          addresses: {
            $elemMatch: {
              $or: [{ [field]: { $regex: term, $options: "i" } }],
            },
          },
        };
      }

      return queryObject;
    });

    user.match({ $or: userMap });
  }
  if (project) {
    const projectString = project.replaceAll(",", " ").trim();
    console.log(projectString);
    user.project(projectString);
  }

  if (sort) {
    const sorting = removeTrailingCommaAndSplit(sort);

    const mappedSorting = sorting.map((sortFeild) => {
      if (
        !allowedUserSearchFeilds.includes(sortFeild) &&
        !allowedAddressSearchFeilds.includes(sortFeild)
      )
        throw new Error(`${sortFeild} is not allowed`);
      if (allowedAddressSearchFeilds.includes(sortFeild)) {
        return `addresses.${sortFeild}`;
      }
      return sortFeild;
    });

    const newsortString = mappedSorting.join(" ");

    user.sort(newsortString);
  }

  if (user.pipeline.length === 0) {
    user.match({});
  }

  if (page && limit) {
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      customLabels: {
        docs: "data",
      },
    };
    return User.aggregatePaginate(user, options);
  }

  return user;
};

export const createUser = (body) => {
  const {
    first_name,
    last_name,
    email,
    password,
    bio,
    gender,
    phoneNumber,
    addresses,
    facebook_link,
    x_link,
    insgram_link,
    confirmPassword,
  } = body;

  return User.create({
    first_name,
    last_name,
    email,
    phoneNumber,
    password,
    confirmPassword,
    bio,
    gender,
    addresses,
    social_links: { facebook_link, x_link, insgram_link },
  });
};

export const signIn = async (body) => {
  const { email, password } = body;
  if (!email || !password)
    throw UnAuthorized("Email and password are required");
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw NotFound("User not found");
  const passwordMatch = compareSync(password, user.password);
  if (!passwordMatch) throw UnAuthorized("Invalid Credintails");
  if (!user.isActive) throw UnAuthorized("Account Pending Email Varification");
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  return token;
};

export const signUp = async (body) => {
  const user = await createUser(body);
  const ActivationToken = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
  );
  const ActivationLink = `${process.env.APP_URL}:${process.env.PORT}/auth/activate/${ActivationToken}`;
  MailEmmiters.emit("register", user, "Welcome to BlogApp");
  MailEmmiters.emit("activate", user, "Activate your account", ActivationLink);
  return user;
};

export const getProfile = async (user) => {
  user.phoneNumber = crypto.AES.decrypt(
    user.phoneNumber,
    process.env.ENCRYPTION_KEY,
  ).toString(crypto.enc.Utf8);
  if (!user) throw NotFound("User not found");
  return user;
};

export const activateUserAccount = async (token) => {
  const { email } = jwt.verify(token, process.env.JWT_SECRET);
  let user = await User.findOne({ email: email });
  if (!user) throw NotFound("User not found");
  if (user.isActive) return false;
  user.isActive = true;
  await user.save({ validateModifiedOnly: true });
  return true
};
