import express from 'express';
import { createUser } from './userController';
import { RequestHandler } from 'express';

const userRouter = express.Router();

//routes
// userRouter.post("/register", createUser as RequestHandler);

userRouter.post("/register", createUser);







// end code 

export default userRouter;

