import express from 'express';
import { createUser } from './userController';
import { RequestHandler } from 'express';
import { loginUser } from './userController';

const userRouter = express.Router();

//routes
// userRouter.post("/register", createUser as RequestHandler);

    userRouter.post("/register", createUser);
    userRouter.post("/login", loginUser);







// end code 

export default userRouter;

