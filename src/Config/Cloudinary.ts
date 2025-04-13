import { v2 as cloudinary } from "cloudinary";
import { config } from "./config";

if (
  !config.cloudinaryCloud ||
  !config.cloudinaryApiKey ||
  !config.cloudinarySecret
) {
  throw new Error("Missing Cloudinary configuration in environment variables");
}

cloudinary.config({
  cloud_name: config.cloudinaryCloud,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinarySecret,
});

// end code

export default cloudinary;
