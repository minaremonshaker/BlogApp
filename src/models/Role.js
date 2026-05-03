import RolesSchema from "../db/Schemas/RolesSchema.js";
import mongoose from "mongoose";
import Permission from "../models/Permission.js";


/**
 * Assigns permissions to a role.
 * @param {ObjectId | string} role - The role to assign permissions to.
 * @param {...string} permissions - The permissions to assign.
 * @throws {Error} Throws an error if the role is not found or if any of the permissions are not found.
 * @returns {Promise<Role>} The updated role document.
 */
RolesSchema.statics.assignPermissions = async function (role, ...permissions) {
  try {
    const roleDoc = await this.findById(role);
    if (!roleDoc) {
      throw new Error("Role not found");
    }
    const permissionsDocs = await Permission.find({}, { name: 1 });
    const permissionNames = permissionsDocs.map((doc) => doc.name);

    if (
      !permissions.every((permission) => permissionNames.includes(permission))
    ) {
      const notFondPermissions = permissions.filter(
        (permission) => !permissionNames.includes(permission),
      );
      const permissionError = new Error();
      permissionError.name = "PermissionError";
      permissionError.message = `some permissions are not found in permissions collection: ${notFondPermissions.join(", ")}`;
      throw permissionError;
    }

    const filterPermissionsIds = permissionsDocs
      .filter((doc) => permissions.includes(doc.name))
      .map((doc) => doc._id);

    roleDoc.permissions = filterPermissionsIds;

    await roleDoc.save();

    return roleDoc;

  } catch (err) {
    throw err;
  }
};

const Role = mongoose.model("Role", RolesSchema);

export default Role;
