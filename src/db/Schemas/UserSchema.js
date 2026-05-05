import mongoose from "mongoose";
import AddressSchema from "./AddressSchema.js";

const { Schema } = mongoose;

export const gender = {
  male: "male",
  female: "female",
  others: "others",
};

const UserSchema = new Schema(
  {
    first_name: {
      type: String,
      required: [true, "{PATH} required"],
      trim: true,
      lowercase: true,
    },
    last_name: {
      type: String,
      required: [true, "{PATH} required"],
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "{PATH} required"],
      match: [
        /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
        "Please enter a valid email address",
      ],
      unique: true,
      lowercase: true,
      trim: true,
    },
    bio: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      required: [true, "{PATH} required"],
      enum: {
        values: Object.values(gender),
        message: "{PATH} need to be male, female, other",
      },
    },
    phoneNumber: {
      type: String,
      required: [true, "{PATH} required"],
      validate: {
        validator: function (value) {
          if (!/^\d+$/.test(value)) throw new Error("{PATH} must be number");
        },
      },
      default: "",
    },
    addresses: {
      type: [AddressSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    social_links: {
      facebook_link: {
        type: String,
        match: [
          /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#@!$&'()*+,;=%]+)?$/,
          "Please enter a valid Facebook link",
        ],
        default: "",
      },
      x_link: {
        type: String,
        match: [
          /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#@!$&'()*+,;=%]+)?$/,
          "Please enter a valid X link",
        ],
        default: "",
      },
      instagram_link: {
        type: String,
        match: [
          /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#@!$&'()*+,;=%]+)?$/,
          "Please enter a valid Instagram link",
        ],
        default: "",
      },
    },
    password: {
      type: String,
      required: [true, "{PATH} required"],
      minLength: [6, "Password must have a minimum length of 6 characters"],
      maxLength: [15, "Password must be maximuin length of 15 character"],
      select: false,
      trim: true,
      validate: {
        validator: function (value) {
          const errors = [];
          if (!/[A-Z]/.test(value)) errors.push("uppercase letter");
          if (!/[a-z]/.test(value)) errors.push("lowercase letter");
          if (!/[0-9]/.test(value)) errors.push("number");
          if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value))
            errors.push("special character");

          if (errors.length > 0) {
            throw new Error(
              `Password must contain at least one: ${errors.join(", ")}.`,
            );
          }
          return true;
        },
      },
    },
    confirmPassword: {
      type: String,
      required: [true, "{PATH} required"],
      minLength: [6, "Password must have a minimum length of 6 characters"],
      maxLength: [15, "Password must be maximuin length of 15 character"],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Password do not match",
      },
      select: false,
      trim: true,
    },
  },
  { timestamps: true },
);

export default UserSchema;
