import mongoose from "mongoose";

const { Schema } = mongoose;

const RoleSchema = new Schema({
  name: {
    type: String,
    required: [true, "{PATH} required"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  permissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
    },
  ],
});

export default RoleSchema;


