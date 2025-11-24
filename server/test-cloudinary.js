import cloudinary from "./config/cloudinary.js";


console.log("Testing Cloudinary configuration...");
console.log("Cloud Name:", process.env.CLOUDNARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDNARY_API_KEY);
console.log(
  "API Secret:",
  process.env.CLOUDINARY_API_SECRET ? "***configured***" : "MISSING"
);

// Test connection
cloudinary.api
  .ping()
  .then(result => {
    console.log("✅ Cloudinary connection successful!");
    console.log("Result:", result);
  })
  .catch(error => {
    console.error("❌ Cloudinary connection failed!");
    console.error("Error:", error.message);
  });
