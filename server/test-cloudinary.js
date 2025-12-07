import cloudinary from "./config/cloudinary.js";


  "API Secret:",
  process.env.CLOUDINARY_API_SECRET ? "***configured***" : "MISSING"
);

// Test connection
cloudinary.api
  .ping()
  .then(result => {
  })
  .catch(error => {
    console.error("❌ Cloudinary connection failed!");
    console.error("Error:", error.message);
  });
