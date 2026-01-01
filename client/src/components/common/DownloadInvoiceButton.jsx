import { Download } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function DownloadInvoiceButton({ paymentDetails, courses }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const calculateTotal = () => {
        return courses.reduce((total, course) => {
          const price = typeof course.price === 'number' ? course.price : parseFloat(course.price) || 0;
          return total + price;
        }, 0);
      };

      const invoiceContent = `
IKIGAI - INVOICE
================================

Payment ID: ${paymentDetails.paymentId || 'N/A'}
Date: ${new Date().toLocaleString('en-IN')}

COURSES PURCHASED
--------------------------------
${courses.map((course, index) => `
${index + 1}. ${course.title}
   Instructor: ${course.instructor?.firstName || ''} ${course.instructor?.lastName || ''}
   Price: ₹${typeof course.price === 'number' ? course.price.toFixed(2) : course.price}
`).join('')}

PAYMENT SUMMARY
--------------------------------
Subtotal: ₹${calculateTotal().toFixed(2)}
Tax: ₹0.00
Total Paid: ₹${calculateTotal().toFixed(2)}

Payment Method: Razorpay
Status: Success

Thank you for your purchase!
Visit ikigai.com to access your courses.
      `;

      const blob = new Blob([invoiceContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Ikigai-Invoice-${paymentDetails.paymentId || Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
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
