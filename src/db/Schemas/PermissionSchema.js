import mongoose from "mongoose";

const { Schema } = mongoose;

const PermissionSchema = new Schema({
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
});

export default PermissionSchema;