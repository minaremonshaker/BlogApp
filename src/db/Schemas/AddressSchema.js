import mongoose from "mongoose";

const { Schema } = mongoose;

const AddressSchema = new Schema({
  street: {
    type: String,
    required: [true, "{PATH} required"],
  },
  city: {
    type: String,
    required: [true, "{PATH} required"],
  },
  state: {
    type: String,
  },
  country: {
    type: String,
    required: [true, "{PATH} required"],
  },
  zipCode: {
    type: String,
    required: [true, "{PATH} required"],
  },
});

export default AddressSchema;