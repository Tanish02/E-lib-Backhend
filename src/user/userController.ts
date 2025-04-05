import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../Config/config"; 
import { User } from "./userTypes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      const error = createHttpError(400, "All fields are required");
      return next(error);
    }

    // Database call.
    try {
      const existingUser = await userModel.findOne({ email });

      if (existingUser) {
        const error = createHttpError(400,
           "User already exists with this email.");
        return next(error);
      }
    } catch (err) {
      return next(createHttpError(500,
         "Error while getting user"));
    }



    /// password -> hash


    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser: User;
    try {
      newUser = await userModel.create({
        name,
        email,
        password: hashedPassword,
      });
    } catch (err) {
      return next(createHttpError(500,
         "Error while creating user."));
    }

    try {
      // Token generation JWT
      const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
        expiresIn: "7d",
        algorithm: "HS256",
      });

      // Response

      res.status(201).json({ accessToken: token });
    } catch (err) {
      return next(createHttpError(500, 
        "Error while signing jwt token"));
    }
  } catch (error) {
    next(error);
  }
};
     



   

// end code 

export { createUser };
