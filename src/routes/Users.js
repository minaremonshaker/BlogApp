

import {Router} from 'express'
import * as UserController from '../controllers/Users.js'


const userRouter = Router();

userRouter.get("/", UserController.index);
userRouter.post('/',  UserController.store)
userRouter.get("/:id", UserController.show);
userRouter.patch('/:id', UserController.update)
userRouter.put('/:id', UserController.replace)
userRouter.delete("/:id", UserController.destroy)


export default userRouter;