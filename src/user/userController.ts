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
      console.error(
        "Error: Validation failed in createUser. All fields are required."
      );
      return next(error);
    }

    // Database call.

    try {
      const existingUser = await userModel.findOne({ email });

      if (existingUser) {
        const error = createHttpError(
          400,
          "User already exists with this email."
        );
        console.error(
          `Error: User already exists. user: ${name}, email: ${email}`
        );
        return next(error);
      }
    } catch (err) {
      console.error(
        `Error: Database error while checking for user. email: ${email}`,
        err
      );
      return next(
        createHttpError(500, "Error while checking for an existing user")
      );
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
      console.log(
        `Success: User registered. user: ${newUser.name}, email: ${newUser.email}`
      );
    } catch (err) {
      console.error(
        `Error: Database error while creating user. user: ${name}, email: ${email}`,
        err
      );
      return next(createHttpError(500, "Error while creating a new user"));
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
      console.error(
        `Error: JWT signing failed. user: ${newUser.name}, email: ${newUser.email}`,
        err
      );
      return next(createHttpError(500, "Error while signing the JWT"));
    }
  } catch (error) {
    console.error("Error: Unhandled exception in createUser.", error);
    next(error);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    console.error(
      "Error: Validation failed in loginUser. All fields are required."
    );
    return next(createHttpError(400, "All fields are required"));
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      console.error(`Error: Login failed, user not found. email: ${email}`);
      return next(createHttpError(404, "User not found"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.error(
        `Error: Login failed, incorrect password. user: ${user.name}, email: ${user.email}`
      );
      return next(createHttpError(400, "Username or password incorrect!"));
    }

    console.log(
      `Success: User logged in. user: ${user.name}, email: ${user.email}`
    );

    // create access token
    // to-do try catch error handling
    const token = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });

    res.json({ accessToken: token });
  } catch (err) {
    console.error(
      `Error: An error occurred during login for email: ${email}`,
      err
    );
    return next(createHttpError(500, "Error while logging in the user"));
  }
};

// end code.

export { createUser, loginUser };
