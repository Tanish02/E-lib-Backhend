"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const config_1 = require("./config");
if (!config_1.config.cloudinaryCloud ||
    !config_1.config.cloudinaryApiKey ||
    !config_1.config.cloudinarySecret) {
    throw new Error("Missing Cloudinary configuration in environment variables");
}
cloudinary_1.v2.config({
    cloud_name: config_1.config.cloudinaryCloud,
    api_key: config_1.config.cloudinaryApiKey,
    api_secret: config_1.config.cloudinarySecret,
});
// end code
exports.default = cloudinary_1.v2;
