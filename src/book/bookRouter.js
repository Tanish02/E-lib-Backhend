"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookControler_1 = require("./bookControler");
const multer_1 = __importDefault(require("multer"));
const node_path_1 = __importDefault(require("node:path"));
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const bookRouter = express_1.default.Router();
// file storage config
const upload = (0, multer_1.default)({
    dest: node_path_1.default.resolve(__dirname, "../../public/data/uploads"),
    limits: { fileSize: 1e7 }, // 3e7 original 30 mb
    //30mb limit but cloudinary limit 10mb MAX
});
//routes
bookRouter.post("/", authenticate_1.default, upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
]), bookControler_1.createBook);
bookRouter.patch("/:bookId", authenticate_1.default, upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
]), bookControler_1.updateBook);
bookRouter.get("/", bookControler_1.listBooks);
bookRouter.get("/:bookId", bookControler_1.getSingleBook);
bookRouter.delete("/:bookId", authenticate_1.default, bookControler_1.deleteBook);
// end code
exports.default = bookRouter;
