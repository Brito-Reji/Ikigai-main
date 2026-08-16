import axios from "axios";
import logger from "./logger.js";

export const sendTelegram = async (text) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return;
  }

  try {
    await axios.post(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      },
      { timeout: 8000 }
    );
  } catch (error) {
    logger.error("Failed to send Telegram message: %s", error.message);
  }
};
