import express from "express";
import { createUser, loginUser } from "./userController";

const userRouter = express.Router();

//routes

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);

// end code

export default userRouter;
