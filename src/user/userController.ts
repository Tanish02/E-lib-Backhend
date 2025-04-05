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

    // Check for existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      const error = createHttpError(400, "User already exists with this email");
      return next(error);
    }

    // Hash the password
    let hashedPassword: string;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return next(createHttpError(500, "Error while hashing password"));
    }

    // Create new user
    let newUser: User;
    try {
      newUser = await userModel.create({
        name,
        email,
        password: hashedPassword,
      });
    } catch (err) {
      return next(createHttpError(500, 'Error while creating user: ${err instanceof Error ? err.message : String(err)}'));
    }

    // Generate JWT token
    let token: string;
    try {
      token = sign({ sub: newUser._id }, config.jwtSecret as string, {
        expiresIn: "7d",
        algorithm: "HS256",
      });
    } catch (err) {
      return next(createHttpError(500, "Error while generating JWT token"));
    }

    // Send response
    res.status(201).json({
      id: newUser._id,
      token,
      name: newUser.name,
      email: newUser.email
    });
  } catch (error) {
    next(error);
  }
};

// end code 
export { createUser };