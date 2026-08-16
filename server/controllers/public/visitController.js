import asyncHandler from "express-async-handler";
import { sendTelegram } from "../../utils/telegram.js";

const VISIT_THROTTLE_MS = 10 * 60 * 1000;
const recentVisits = new Map();

const pruneOldVisits = (now) => {
  for (const [key, timestamp] of recentVisits) {
    if (now - timestamp > VISIT_THROTTLE_MS) {
      recentVisits.delete(key);
    }
  }
};

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || "unknown";
};

const summarizeUserAgent = (userAgent = "") => {
  if (!userAgent) return "unknown";
  return userAgent.slice(0, 120);
};

export const recordVisit = asyncHandler(async (req, res) => {
  const ip = getClientIp(req);
  const now = Date.now();
  pruneOldVisits(now);

  const lastVisit = recentVisits.get(ip);
  if (lastVisit && now - lastVisit < VISIT_THROTTLE_MS) {
    return res.status(204).send();
  }

  recentVisits.set(ip, now);

  const path = typeof req.body?.path === "string" && req.body.path.trim()
    ? req.body.path.trim().slice(0, 200)
    : "/";
  const referrer =
    typeof req.body?.referrer === "string" && req.body.referrer.trim()
      ? req.body.referrer.trim().slice(0, 300)
      : "(direct)";

  void sendTelegram(
    [
      "New visit",
      `Path: ${path}`,
      `Referrer: ${referrer}`,
      `IP: ${ip}`,
      `Device: ${summarizeUserAgent(req.headers["user-agent"])}`,
    ].join("\n")
  );

  return res.status(204).send();
});
