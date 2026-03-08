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
exports.updateBook = exports.listBooks = exports.getSingleBook = exports.deleteBook = exports.createBook = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = __importDefault(require("mongoose"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const Cloudinary_1 = __importDefault(require("../Config/Cloudinary"));
const bookModel_1 = __importDefault(require("./bookModel"));
const createBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { title, genre, description, author } = req.body;
    const files = req.files;
    try {
        // Debug logging
        console.log("Request body:", req.body);
        console.log("Extracted fields:", { title, genre, description, author });
        // Validate required fields
        if (!title || !genre || !description || !author) {
            const missingFields = [];
            if (!title)
                missingFields.push("title");
            if (!genre)
                missingFields.push("genre");
            if (!description)
                missingFields.push("description");
            if (!author)
                missingFields.push("author");
            return next((0, http_errors_1.default)(400, `Missing required fields: ${missingFields.join(", ")}`));
        }
        if (!((_a = files === null || files === void 0 ? void 0 : files.coverImage) === null || _a === void 0 ? void 0 : _a[0]) || !((_b = files === null || files === void 0 ? void 0 : files.file) === null || _b === void 0 ? void 0 : _b[0])) {
            return next((0, http_errors_1.default)(400, "Cover image or book file missing"));
        }
        const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
        const fileName = files.coverImage[0].filename;
        const filePath = node_path_1.default.resolve(__dirname, "../../public/data/uploads", fileName);
        const uploadResult = yield Cloudinary_1.default.uploader.upload(filePath, {
            filename_override: fileName,
            folder: "books-covers",
            format: coverImageMimeType,
        });
        const bookFileName = files.file[0].filename;
        const bookFilePath = node_path_1.default.resolve(__dirname, "../../public/data/uploads", bookFileName);
        const bookFileUploadResult = yield Cloudinary_1.default.uploader.upload(bookFilePath, {
            resource_type: "raw",
            filename_override: bookFileName,
            folder: "books-pdfs",
            format: "pdf",
        });
        // console.log("bookFileUploadResult", bookFileUploadResult);
        // console.log("uploadResult", uploadResult);
        // // @ts-ignore
        // console.log("userId", req.userId);
        const _req = req;
        const newBook = yield bookModel_1.default.create({
            title,
            genre,
            description,
            author,
            uploader: _req.userId,
            coverImage: uploadResult.secure_url,
            file: bookFileUploadResult.secure_url,
        });
        // Delete temp data file
        yield node_fs_1.default.promises.unlink(filePath);
        yield node_fs_1.default.promises.unlink(bookFilePath);
        res
            .status(201)
            .json({ id: newBook._id, message: "Book uploaded successfully" });
    }
    catch (err) {
        console.log("Error in createBook:", err);
        // Check if it's a validation error
        if (err.name === "ValidationError") {
            const validationErrors = Object.keys(err.errors).map((key) => {
                return `${key}: ${err.errors[key].message}`;
            });
            return next((0, http_errors_1.default)(400, `Validation failed: ${validationErrors.join(", ")}`));
        }
        return next((0, http_errors_1.default)(500, "Error uploading book"));
    }
});
exports.createBook = createBook;
const updateBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { title, genre, description } = req.body;
        const bookId = req.params.bookId;
        const book = yield bookModel_1.default.findOne({ _id: bookId });
        if (!book) {
            return next((0, http_errors_1.default)(404, "Book not found"));
        }
        // access checking
        const _req = req;
        if (book.uploader.toString() !== _req.userId) {
            return next((0, http_errors_1.default)(403, "Not allowed to update this book"));
        }
        const files = req.files;
        let completeCoverImage = "";
        if ((_a = files === null || files === void 0 ? void 0 : files.coverImage) === null || _a === void 0 ? void 0 : _a[0]) {
            const filename = files.coverImage[0].filename;
            const coverMimeType = files.coverImage[0].mimetype.split("/").at(-1);
            // send file to cloudinary
            const filePath = node_path_1.default.resolve(__dirname, "../../public/data/uploads", filename);
            completeCoverImage = filename;
            const uploadResult = yield Cloudinary_1.default.uploader.upload(filePath, {
                filename_override: completeCoverImage,
                folder: "books-covers",
                format: coverMimeType,
            });
            completeCoverImage = uploadResult.secure_url;
            yield node_fs_1.default.promises.unlink(filePath);
        }
        // check file present
        let completeFileName = "";
        if ((_b = files === null || files === void 0 ? void 0 : files.file) === null || _b === void 0 ? void 0 : _b[0]) {
            const bookFilePath = node_path_1.default.resolve(__dirname, "../../public/data/uploads", files.file[0].filename);
            const bookFileName = files.file[0].filename;
            completeFileName = bookFileName;
            const uploadResultPdf = yield Cloudinary_1.default.uploader.upload(bookFilePath, {
                resource_type: "raw",
                filename_override: completeFileName,
                folder: "books-pdfs",
                format: "pdf",
            });
            completeFileName = uploadResultPdf.secure_url;
            yield node_fs_1.default.promises.unlink(bookFilePath);
        }
        const updatedBook = yield bookModel_1.default.findOneAndUpdate({ _id: bookId }, {
            title: title,
            description: description,
            genre: genre,
            coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
            file: completeFileName ? completeFileName : book.file,
        }, { new: true });
        // console.log("updatedBook", updatedBook);
        res.json({ message: "Book updated successfully", updatedBook });
    }
    catch (err) {
        console.error("Error in updateBook:", JSON.stringify(err, null, 2));
        return next((0, http_errors_1.default)(500, "Error updating book"));
    }
});
exports.updateBook = updateBook;
const listBooks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //
        const book = yield bookModel_1.default.find();
        res.json(book);
    }
    catch (err) {
        return next((0, http_errors_1.default)(500, "Error getting the books from list"));
    }
});
exports.listBooks = listBooks;
const getSingleBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    if (!mongoose_1.default.Types.ObjectId.isValid(bookId)) {
        return next((0, http_errors_1.default)(400, "Invalid book ID in database"));
    }
    try {
        const book = yield bookModel_1.default.findById(bookId);
        if (!book) {
            return next((0, http_errors_1.default)(404, "Book not found in the database"));
        }
        res.json(book);
    }
    catch (err) {
        return next((0, http_errors_1.default)(500, "Error getting book details "));
    }
});
exports.getSingleBook = getSingleBook;
const deleteBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const bookId = req.params.bookId;
    const book = yield bookModel_1.default.findOne({ _id: bookId });
    if (!book) {
        return next((0, http_errors_1.default)(404, "Book not found"));
    }
    // check access
    const _req = req;
    if (book.uploader.toString() !== _req.userId) {
        return next((0, http_errors_1.default)(403, "Not allowed to delete this book"));
    }
    const coverFileSplits = book.coverImage.split("/");
    const coverImagePublicId = coverFileSplits.at(-2) + "/" + ((_b = (_a = coverFileSplits.at(-1)) === null || _a === void 0 ? void 0 : _a.split(".")) === null || _b === void 0 ? void 0 : _b.at(-2));
    console.log("coverFileSplits ", coverFileSplits);
    console.log("coverImagePublicId ", coverImagePublicId);
    const bookFileSplits = book.file.split("/");
    const bookFilePublicId = bookFileSplits.at(-2) + "/" + bookFileSplits.at(-1);
    console.log("bookFilePublicId ", bookFilePublicId);
    yield Cloudinary_1.default.uploader.destroy(coverImagePublicId);
    yield Cloudinary_1.default.uploader.destroy(bookFilePublicId, { resource_type: "raw" });
    yield bookModel_1.default.deleteOne({ _id: bookId });
    console.log("Book deleted successfully");
    res.json({ message: "Book deleted successfully" });
    // res.sendStatus(204);
});
exports.deleteBook = deleteBook;
