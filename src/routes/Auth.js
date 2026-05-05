import { Router } from 'express';
import * as AuthController from '../controllers/Auth.js';
import auth from '../middlewares/auth.js';
import asyncHandler from "../utils/asyncHandler.js"


const AuthRouter = Router()

AuthRouter.post("/register", asyncHandler(AuthController.register));
AuthRouter.post("/login", asyncHandler(AuthController.login));
AuthRouter.get("/profile", auth, asyncHandler(AuthController.profile));
AuthRouter.get("/activate/:token", asyncHandler(AuthController.activate));


export default AuthRouter