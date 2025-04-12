import Mongoose from "mongoose";
import { Book } from "./bookTypes";

const bookSchema = new Mongoose.Schema<Book>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
    },

    coverImage: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// end code

export default Mongoose.model<Book>("Book", bookSchema);
