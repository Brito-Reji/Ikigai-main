import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";


dotenv.config();

const PORT = 3000;

// Add this at the top of your main file

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

  const error = new Error();
  const stack = error.stack.split("\n")[2];
  const match = stack.match(/at\s+(.+):(\d+):(\d+)/);

  if (match) {
    const [, file, line] = match;
    const fileName = file.split("/").pop(); // Get just the filename
    originalLog(`${colors.cyan}[${fileName}:${line}]${colors.reset}`, ...args);
  } else {
    originalLog(...args);
  }
};


connectDB();
app.listen(PORT, () => {
});
