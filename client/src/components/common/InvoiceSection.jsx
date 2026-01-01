import { FileText, Calendar, CreditCard } from "lucide-react";

export default function InvoiceSection({ paymentDetails, courses }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateSubtotal = () => {
    return courses.reduce((total, course) => {
      const price = typeof course.price === 'number' ? course.price : parseFloat(course.price) || 0;
      return total + price;
    }, 0);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Invoice</h3>
            <p className="text-sm text-gray-500">Payment Receipt</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-gray-100">
        <div>
          <p className="text-sm text-gray-500 mb-1">Payment ID</p>
          <p className="text-sm font-mono font-semibold text-gray-900 break-all">
            {paymentDetails.paymentId || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Date & Time</p>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <p className="text-sm font-medium text-gray-900">
              {formatDate(new Date())}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Order Details
        </h4>
        {courses.map((course, index) => (
          <div key={index} className="flex justify-between items-start text-sm">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{course.title}</p>
              <p className="text-xs text-gray-500">
                {course.instructor?.firstName} {course.instructor?.lastName}
              </p>
            </div>
            <p className="font-semibold text-gray-900">
              ₹{typeof course.price === 'number' ? course.price.toFixed(2) : course.price}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal ({courses.length} items)</span>
          <span>₹{calculateSubtotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Tax</span>
          <span>₹0.00</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="text-base font-bold text-gray-900">Total Paid</span>
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            ₹{calculateSubtotal().toFixed(2)}
          </span>
        </div>
      </div>

      <div className="bg-indigo-50 rounded-lg p-3 flex items-start gap-3">
        <CreditCard className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-indigo-900">Payment Method</p>
          <p className="text-xs text-indigo-700">Razorpay - Online Payment</p>
        </div>
      </div>
    </div>
  );
}
