import { Types } from "mongoose";
import { User } from "../user/userTypes";

export interface Book {
  _id: string;
  title: string;
  description: string;
  author: string;
  uploader: Types.ObjectId;
  genre: string;
  coverImage: string;
  file: string;
  createAt: Date;
  updatedAt: Date;
}
