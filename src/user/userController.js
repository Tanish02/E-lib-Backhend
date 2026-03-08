"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createUser = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const userModel_1 = __importDefault(require("./userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../Config/config");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        // Validation
        if (!name || !email || !password) {
            const error = (0, http_errors_1.default)(400, "All fields are required");
            console.error("Error: Validation failed in createUser. All fields are required.");
            return next(error);
        }
        // Database call.
        try {
            const existingUser = yield userModel_1.default.findOne({ email });
            if (existingUser) {
                const error = (0, http_errors_1.default)(400, "User already exists with this email.");
                console.error(`Error: User already exists. user: ${name}, email: ${email}`);
                return next(error);
            }
        }
        catch (err) {
            console.error(`Error: Database error while checking for user. email: ${email}`, err);
            return next((0, http_errors_1.default)(500, "Error while checking for an existing user"));
        }
        /// password -> hash
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        let newUser;
        try {
            newUser = yield userModel_1.default.create({
                name,
                email,
                password: hashedPassword,
            });
            console.log(`Success: User registered. user: ${newUser.name}, email: ${newUser.email}`);
        }
        catch (err) {
            console.error(`Error: Database error while creating user. user: ${name}, email: ${email}`, err);
            return next((0, http_errors_1.default)(500, "Error while creating a new user"));
        }
        try {
            // Token generation JWT
            const token = (0, jsonwebtoken_1.sign)({ sub: newUser._id }, config_1.config.jwtSecret, {
                expiresIn: "7d",
                algorithm: "HS256",
            });
            // Response
            res.status(201).json({ accessToken: token });
        }
        catch (err) {
            console.error(`Error: JWT signing failed. user: ${newUser.name}, email: ${newUser.email}`, err);
            return next((0, http_errors_1.default)(500, "Error while signing the JWT"));
        }
    }
    catch (error) {
        console.error("Error: Unhandled exception in createUser.", error);
        next(error);
    }
});
exports.createUser = createUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        console.error("Error: Validation failed in loginUser. All fields are required.");
        return next((0, http_errors_1.default)(400, "All fields are required"));
    }
    try {
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            console.error(`Error: Login failed, user not found. email: ${email}`);
            return next((0, http_errors_1.default)(404, "User not found"));
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            console.error(`Error: Login failed, incorrect password. user: ${user.name}, email: ${user.email}`);
            return next((0, http_errors_1.default)(400, "Username or password incorrect!"));
        }
        console.log(`Success: User logged in. user: ${user.name}, email: ${user.email}`);
        // create access token
        // to-do try catch error handling
        const token = (0, jsonwebtoken_1.sign)({ sub: user._id }, config_1.config.jwtSecret, {
            expiresIn: "7d",
            algorithm: "HS256",
        });
        res.json({ accessToken: token });
    }
    catch (err) {
        console.error(`Error: An error occurred during login for email: ${email}`, err);
        return next((0, http_errors_1.default)(500, "Error while logging in the user"));
    }
});
exports.loginUser = loginUser;
