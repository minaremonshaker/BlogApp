/**
 * Maps a user object to a simplified representation.
 *
 * @param {Object} user - The user object.
 * @param {string} user._id - The user ID.
 * @param {string} user.first_name - The user's first name.
 * @param {string} user.last_name - The user's last name.
 * @param {string} user.email - The user's email.
 * @param {string} user.bio - The user's bio.
 * @param {string} user.gender - The user's gender.
 * @param {string} user.phoneNumber - The user's phone number.
 * @param {Array<Object>} user.addresses - The user's addresses.
 * @param {boolean} user.isActive - The user's activity status.
 * @param {string} user.facebook_link - The user's Facebook link.
 * @param {string} user.x_link - The user's Twitter link.
 * @param {string} user.instagram_link - The user's Instagram link.
 * @param {Date} user.createdAt - The date the user was created.
 * @param {Date} user.updatedAt - The date the user was last updated.
 * @returns {Object} - The simplified user object.
 */
const usersTemp = (user) => {
  return {
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    bio: user.bio,
    gender: user.gender,
    phone: user.phoneNumber,
    addresses: user.addresses,
    isActive: user.isActive,
    facebook: user.facebook_link,
    twitter: user.x_link,
    instagram: user.instagram_link,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
    links: {
      self: `${process.env.APP_URL}:${process.env.PORT}/users/${user._id}`,
    } 
  };
};

/**
 * Generates the pagination links for a user collection.
 *
 * @param {Object} user - The user collection.
 * @param {Array<Object>} user.data - The user data.
 * @param {boolean} user.hasPrevPage - Indicates if there is a previous page.
 * @param {boolean} user.hasNextPage - Indicates if there is a next page.
 * @param {number} user.page - The current page number.
 * @param {number} user.nextPage - The number of the next page.
 * @param {number} user.prevPage - The number of the previous page.
 * @param {number} user.totalPages - The total number of pages.
 * @returns {Object} - The pagination links.
 */
const pagination = (user) => {
  if (!user?.data) return undefined;
  return {
    first: `${process.env.APP_URL}:${process.env.PORT}/users/?page=1`,
    next: user?.hasNextPage
      ? `${process.env.APP_URL}:${process.env.PORT}/users/?page=${user.nextPage}`
      : undefined,
    curr: `${process.env.APP_URL}:${process.env.PORT}/users/?page=${user?.page}`,

    perv: user?.hasPrevPage
      ? `${process.env.APP_URL}:${process.env.PORT}/users/?page=${user.prevPage}`
      : undefined,
    last: `${process.env.APP_URL}:${process.env.PORT}/users/?page=${user?.totalPages}`,
    pages: Array.from(
      { length: user?.totalPages },
      (_, i) =>
        `${process.env.APP_URL}:${process.env.PORT}/users/?page=${i + 1}`,
    ),
  };
};


/**
 * Maps a collection of users to a more simplified representation.
 *
 * @param {Array<Object>} usersCollection - The collection of users.
 * @returns {Array<Object>} - The mapped collection of users.
 */
export const userCollectionMap = (usersCollection) => {
  return {
    meta: {
      hasPrev: usersCollection?.hasPrevPage ?? undefined,
      hasNext: usersCollection?.hasNextPage ?? undefined,
      count: usersCollection?.data?.length ?? usersCollection?.length,
    },
    links: pagination(usersCollection),
    data:
      usersCollection?.data?.map((user) => usersTemp(user)) ??
      usersCollection.map((user) => usersTemp(user)),
  };
};

export const singleUser = (user, message) => {
  return {
    meta: {
      message: message,
    },
    data: Object.entries(user).length === 0 ? undefined : usersTemp(user),
  };
};
