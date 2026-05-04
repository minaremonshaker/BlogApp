import { Router } from 'express';
import * as AuthController from '../controllers/Auth.js';
import auth from '../middlewares/auth.js';


const AuthRouter = Router()

AuthRouter.post("/register", AuthController.register);
AuthRouter.post("/login", AuthController.login);
AuthRouter.get("/profile", auth, AuthController.profile);
AuthRouter.get("/activate/:token", AuthController.activate);


export default AuthRouter