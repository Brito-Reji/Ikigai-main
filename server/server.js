import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, ".env");

const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error("Error loading .env:", result.error);
  process.exit(1);
}

// Import modules AFTER dotenv has loaded
const { default: app } = await import("./app.js");
const { connectDB } = await import("./config/db.js");
const { default: logger } = await import("./utils/logger.js");
const { releaseEscrowJob } = await import("./cron/releaseEscrow.js");

const PORT = process.env.PORT || 3000;

connectDB();

// start cron jobs
releaseEscrowJob();

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
