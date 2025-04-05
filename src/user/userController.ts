import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../Config/config";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      const error = createHttpError(400, "All fields are required");
      return next(error);
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      const error = createHttpError(400, "User already exists with this email");
      return next(error);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate a JWT token


    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
        expiresIn: "7d",
        algorithm: "HS256",
    });



    // Send response
    res.json({ id: newUser._id, token });
  } catch (error) {
    next(error);
  }
};


// end code 

export { createUser };