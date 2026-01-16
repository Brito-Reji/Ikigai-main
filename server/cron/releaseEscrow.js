import cron from "node-cron";
import { Payment } from "../models/Payment.js";

// release held funds after 7 days
export const releaseEscrowJob = () => {
  // run daily at midnight
  cron.schedule("0 0 * * *", async () => {
    console.log("[CRON] Running escrow release job...");

    try {
      const now = new Date();

      const result = await Payment.updateMany(
        {
          status: "PAID",
          releaseStatus: "HELD",
          releaseDate: { $lte: now },
        },
        {
          releaseStatus: "RELEASED",
        }
      );

      console.log(
        `[CRON] Released ${result.modifiedCount} payments from escrow`
      );
    } catch (error) {
      console.error("[CRON] Escrow release error:", error);
    }
  });

  console.log("[CRON] Escrow release job scheduled (daily at midnight)");
};
