import UserSchema from "../db/Schemas/UserSchema.js";
import mongoose from "mongoose";
import paginate from "mongoose-aggregate-paginate-v2";
import bcrypt from "bcrypt";
import crypto from "crypto-js";
import Role from "./Role.js";


export const allowedUserSearchFeilds = ["first_name", "last_name", "email"];
export const allowedAddressSearchFeilds = ["street", "zipCode"];

/**
 * Applies the pagination plugin to the UserSchema.
 *
 * @return {void}
 */
UserSchema.plugin(paginate);

/**
 * Pre-save middleware that removes the confirmPassword field from the user
 * document before saving.
 *
 * @return {Promise<void>} Resolves when the middleware has completed.
 */
UserSchema.pre("save", async function () {
  this.confirmPassword = undefined;
});

/**
 * Encrypts the user's phone number before saving the user document.
 *
 * @return {Promise<void>} - Resolves when the phone number has been encrypted
 * and saved, or rejects with an error if the encryption fails.
 */
UserSchema.pre("save", async function () {
  const encryptedPhoneNumber = crypto.AES.encrypt(
    this.phoneNumber,
    process.env.ENCRYPTION_KEY,
  );
  this.phoneNumber = encryptedPhoneNumber.toString();
});


/**
 * Pre-save middleware that assigns the 'user' role to new users that do not
 * have any roles assigned.
 *
 * @return {Promise<void>} - Resolves when the middleware has completed, or
 * rejects with an error if the role lookup fails.
 */
UserSchema.pre('save', async function () {
  if(this.isNew && (!this.roles || this.roles.length === 0)) {
     const userRole = await Role.findOne({ name: 'user' });
     this.roles = [userRole._id];
  }
});

/**
 * Pre-save middleware that hashes the password before saving the user
 * document.
 *
 * @returns {Promise<void>} - Resolves when the password has been hashed and
 * saved, or rejects with an error if the hashing fails.
 */
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
});


/**
 * Returns a Mongoose model for the User schema.
 *
 * @returns {mongoose.Model} The User model.
 */

const User = mongoose.model("User", UserSchema);

export default User;
