import express from "express";
import {
  createBook,
  updateBook,
  listBooks,
  getSingleBook,
} from "./bookControler";
import multer from "multer";
import path from "node:path";
import authenticate from "../middlewares/authenticate";
import { AuthRequest } from "../middlewares/authenticate";

const bookRouter = express.Router();

// file storage config

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 1e7 }, // 3e7 original 30 mb
  //30mb limit but cloudinary limit 10mb MAX
});

//routes

bookRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

bookRouter.patch(
  "/:bookId",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);

bookRouter.get("/", listBooks);
bookRouter.get("/:bookId", getSingleBook);

// end code

export default bookRouter;
