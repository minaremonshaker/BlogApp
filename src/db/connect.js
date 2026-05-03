import mongoose from "mongoose";

/**
 * @type {Promise<mongoose.Mongoose>}
 */
export let db;

export const connect = async () => {
  try {
    db = await mongoose.connect(process.env.MOGODB_URL);
    console.log("Database connected");
  } catch (error) {
    console.error("Connection error:", error.message);
  }
};
