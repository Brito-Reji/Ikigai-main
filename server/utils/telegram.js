import axios from "axios";
import logger from "./logger.js";

const API_TIMEOUT_MS = 8000;

export const getTelegramToken = () => process.env.TELEGRAM_BOT_TOKEN?.trim();

export const getTelegramAdminChatId = () => process.env.TELEGRAM_CHAT_ID?.trim();

export const sendTelegramToChat = async (chatId, text) => {
  const token = getTelegramToken();
  if (!token || !chatId) {
    return false;
  }

  try {
    await axios.post(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      },
      { timeout: API_TIMEOUT_MS }
    );
    return true;
  } catch (error) {
    logger.error("Failed to send Telegram message: %s", error.message);
    return false;
  }
};

export const sendTelegram = async (text) => {
  const chatId = getTelegramAdminChatId();
  if (!chatId) {
    return false;
  }
  return sendTelegramToChat(chatId, text);
};
