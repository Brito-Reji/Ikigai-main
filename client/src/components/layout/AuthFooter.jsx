import React from "react";
import { Link } from "react-router-dom";

export default function AuthFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
          <p>&copy; 2024 Ikigai. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/privacy" className="hover:text-indigo-600 transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-indigo-600 transition">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-indigo-600 transition">
              Contact
            </Link>
            <Link to="/help" className="hover:text-indigo-600 transition">
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
