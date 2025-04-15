import { NextFunction, Request, Response } from "express";
import cloudinary from "../Config/Cloudinary";
import path from "node:path";
import fs from "node:fs";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import { AuthRequest } from "../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;

  const files = req.files as { [filename: string]: Express.Multer.File[] };

  try {
    if (!files?.coverImage?.[0] || !files?.file?.[0]) {
      return next(createHttpError(400, "Cover image or book file missing"));
    }

    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      fileName
    );

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "books-covers",
      format: coverImageMimeType,
    });

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );

    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "books-pdfs",
        format: "pdf",
      }
    );

    // console.log("bookFileUploadResult", bookFileUploadResult);
    // console.log("uploadResult", uploadResult);

    // // @ts-ignore
    // console.log("userId", req.userId);

    const _req = req as AuthRequest;

    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });

    // Delete temp data file

    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookFilePath);

    res
      .status(201)
      .json({ id: newBook._id, message: "Book uploaded successfully" });
  } catch (err) {
    console.log(err);
    return next(createHttpError(500, "Error uploading book"));
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre } = req.body;
    const bookId = req.params.bookId;
    const book = await bookModel.findOne({ _id: bookId });

    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    // access checking

    const _req = req as AuthRequest;
    if (book.author.toString() !== _req.userId) {
      return next(createHttpError(403, "Not allowed to update this book"));
    }

    const files = req.files as { [filename: string]: Express.Multer.File[] };
    let completeCoverImage = "";
    if (files?.coverImage?.[0]) {
      const filename = files.coverImage[0].filename;
      const coverMimeType = files.coverImage[0].mimetype.split("/").at(-1);

      // send file to cloudinary
      const filePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        filename
      );
      completeCoverImage = filename;
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: completeCoverImage,
        folder: "books-covers",
        format: coverMimeType,
      });

      completeCoverImage = uploadResult.secure_url;
      await fs.promises.unlink(filePath);
    }

    // check file exist

    let completeFileName = "";
    if (files?.file?.[0]) {
      const bookFilePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        files.file[0].filename
      );

      const bookFileName = files.file[0].filename;
      completeFileName = bookFileName;

      const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
        resource_type: "raw",
        filename_override: completeFileName,
        folder: "books-pdfs", // fixed folder name
        format: "pdf",
      });
      completeFileName = uploadResultPdf.secure_url;
      await fs.promises.unlink(bookFilePath);
    }

    const updatedBook = await bookModel.findOneAndUpdate(
      { _id: bookId },
      {
        title,
        genre,
        coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
        file: completeFileName ? completeFileName : book.file,
      },
      { new: true }
    );

    // console.log("updatedBook", updatedBook);

    res.json({ message: "Book updated successfully", updatedBook });
  } catch (err) {
    console.error("Error in updateBook:", JSON.stringify(err, null, 2));
    return next(createHttpError(500, "Error updating book"));
  }
};

const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //
    const book = await bookModel.find();
    res.json(book);
  } catch (err) {
    return next(createHttpError(500, "Error getting the books from list"));
  }
};

// end code

export { createBook, updateBook, listBooks };
