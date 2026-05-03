import { Router } from 'express';
import * as AuthController from '../controllers/Auth.js';
import auth from '../middlewares/auth.js';
import authrization from '../middlewares/Authrization.js';


const AuthRouter = Router()

AuthRouter.post("/register", AuthController.register);
AuthRouter.post("/login", AuthController.login);
AuthRouter.get("/profile", auth, authrization('create_user'), AuthController.profile);
AuthRouter.get("/activate/:token", AuthController.activate);


export default AuthRouter