import axios from "axios";
import logger from "./logger.js";
import {
  getTelegramToken,
  getTelegramAdminChatId,
  sendTelegram,
  sendTelegramToChat,
} from "./telegram.js";

const POLL_TIMEOUT_SEC = 25;
const START_MESSAGE = [
  "Ikigai Alert Bot is working.",
  "",
  "You will receive alerts for:",
  "• Website visits",
  "• New student / instructor signups",
  "• Successful purchases",
  "• Courses submitted for review",
  "",
  "Commands:",
  "/start — test this bot",
  "/status — check server connection",
].join("\n");

const STATUS_MESSAGE = "Ikigai backend is online and Telegram alerts are configured.";

let lastUpdateId = 0;
let polling = false;

const handleCommand = async (message) => {
  const chatId = message.chat?.id;
  const text = message.text?.trim();

  if (!chatId || !text) {
    return;
  }

  if (text === "/start" || text.startsWith("/start ")) {
    await sendTelegramToChat(chatId, START_MESSAGE);
    return;
  }

  if (text === "/status") {
    await sendTelegramToChat(chatId, STATUS_MESSAGE);
  }
};

const pollUpdates = async () => {
  const token = getTelegramToken();
  if (!token) {
    return;
  }

  const response = await axios.get(
    `https://api.telegram.org/bot${token}/getUpdates`,
    {
      params: {
        timeout: POLL_TIMEOUT_SEC,
        offset: lastUpdateId + 1,
      },
      timeout: (POLL_TIMEOUT_SEC + 10) * 1000,
    }
  );

  const updates = response.data?.result ?? [];

  for (const update of updates) {
    lastUpdateId = update.update_id;
    if (update.message) {
      await handleCommand(update.message);
    }
  }
};

const pollLoop = async () => {
  if (!polling) {
    return;
  }

  try {
    await pollUpdates();
  } catch (error) {
    logger.error("Telegram bot poll error: %s", error.message);
  }

  if (polling) {
    setTimeout(pollLoop, 500);
  }
};

export const startTelegramBot = async () => {
  const token = getTelegramToken();
  if (!token) {
    return;
  }

  try {
    await axios.post(
      `https://api.telegram.org/bot${token}/deleteWebhook`,
      { drop_pending_updates: false },
      { timeout: 8000 }
    );
  } catch (error) {
    logger.error("Telegram deleteWebhook failed: %s", error.message);
  }

  polling = true;
  void pollLoop();

  logger.info("Telegram bot polling started (/start and /status)");

  if (getTelegramAdminChatId()) {
    void sendTelegram(
      "Ikigai alerts bot is online.\nSend /start in this chat to confirm it is working."
    );
  }
};
