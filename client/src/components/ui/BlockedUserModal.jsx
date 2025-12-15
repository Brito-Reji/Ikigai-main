import { AlertCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BlockedUserModal({ message, onClose }) {
  const navigate = useNavigate();

  const handleClose = () => {
    localStorage.removeItem("accessToken");
    onClose();
    navigate("/login");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Account Blocked</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            {message || "Your account has been blocked by an administrator. Please contact support for more information."}
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
}
