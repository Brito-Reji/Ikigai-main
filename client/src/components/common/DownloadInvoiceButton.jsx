import { Download } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import generateInvoicePdf from "@/utils/generateInvoicePdf";

export default function DownloadInvoiceButton({ paymentDetails, courses, orderData }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // convert paise to rupees if needed
      const amount = orderData?.amount ? orderData.amount / 100 : undefined;
      const discount = orderData?.discountAmount ? orderData.discountAmount / 100 : undefined;

      generateInvoicePdf({
        paymentId: paymentDetails?.paymentId,
        courses: courses || [],
        date: orderData?.createdAt || new Date(),
        orderAmount: amount,
        discountAmount: discount,
        couponCode: orderData?.couponCode,
        paymentMethod: orderData?.paymentMethod,
      });
      toast.success("Invoice downloaded!");
    } catch (error) {
      console.error("PDF error:", error);
      toast.error("Failed to download invoice");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
    >
      <Download className="w-5 h-5" />
      {downloading ? "Preparing..." : "Download Invoice"}
    </button>
  );
}
