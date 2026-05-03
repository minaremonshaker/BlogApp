import Role from "../models/Role.js";

export const RoleSeeder = async () => {
  try {
    const roles = [{ name: "user" }, { name: "admin" }];

    await Role.deleteMany({});
    await Role.insertMany(roles);

    console.log("Roles to be created:", roles);
  } catch (error) {
    console.error("Error in RoleSeeder:", error);
  }
};
