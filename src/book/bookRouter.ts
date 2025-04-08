import express from "express";
import { createBook } from "./bookControler";

const bookRouter = express.Router();

//routes

bookRouter.post("/register", createBook);

// end code

export default bookRouter;
