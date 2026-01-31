import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, ".env");

const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error("Error loading .env:", result.error);
  process.exit(1);
}

// import after dotenv loaded
const { default: app } = await import("./app.js");
const { connectDB } = await import("./config/db.js");
const { default: logger } = await import("./utils/logger.js");
const { releaseEscrowJob } = await import("./cron/releaseEscrow.js");
const { initChatSocket } = await import("./socket/chatSocket.js");

const PORT = process.env.PORT || 3000;

connectDB();

// start cron jobs
releaseEscrowJob();

// create http server
const httpServer = createServer(app);

// setup socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// init chat socket
initChatSocket(io);

// make io available to routes
app.set("io", io);

httpServer.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Socket.IO enabled`);
});
