import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";


dotenv.config();

  "API Secret:",
  process.env.CLOUDINARY_API_SECRET ? "***set***" : "MISSING"
);

cloudinary.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
