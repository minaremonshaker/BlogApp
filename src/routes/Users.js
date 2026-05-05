

import {Router} from 'express'
import * as UserController from '../controllers/Users.js'
import asyncHandler from '../utils/asyncHandler.js'


const userRouter = Router();

userRouter.get("/", asyncHandler(UserController.index) );
userRouter.post('/', asyncHandler(UserController.store));
userRouter.get("/:id", asyncHandler(UserController.show));
userRouter.get('/:id', asyncHandler(UserController.show));
userRouter.patch('/:id', asyncHandler(UserController.update))
userRouter.put('/:id', asyncHandler(UserController.replace))
userRouter.delete("/:id", asyncHandler(UserController.destroy))


export default userRouter;