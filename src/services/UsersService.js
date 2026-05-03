import User, {
  allowedUserSearchFeilds,
  allowedAddressSearchFeilds,
} from "../models/Users.js";
import { removeTrailingCommaAndSplit } from "../utils/stringHelpers.js";

export const getAllUsers = (query) => {
  try {
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

      return User.aggregatePaginate(user,options);
    }

    return user;
  } catch (err) {
    throw err;
  }
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
