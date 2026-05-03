import PermissionSchema from "../db/Schemas/PermissionSchema.js";
import mongoose from "mongoose";

const Permission = mongoose.model("Permission", PermissionSchema);

export default Permission;