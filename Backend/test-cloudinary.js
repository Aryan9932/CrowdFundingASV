// Quick test to verify Cloudinary configuration
import cloudinary from "./config/cloudinary.js";

console.log("🔍 Testing Cloudinary Configuration...\n");

console.log("✅ Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log(
  "✅ API Key:",
  process.env.CLOUDINARY_API_KEY
    ? "***" + process.env.CLOUDINARY_API_KEY.slice(-4)
    : "Missing"
);
console.log(
  "✅ API Secret:",
  process.env.CLOUDINARY_API_SECRET ? "***configured" : "Missing"
);

// Test connection by fetching account info
cloudinary.api
  .ping()
  .then((result) => {
    console.log("\n✅ Cloudinary connection successful!");
    console.log("Status:", result.status);
  })
  .catch((error) => {
    console.error("\n❌ Cloudinary connection failed!");
    console.error("Error:", error.message);
  });
