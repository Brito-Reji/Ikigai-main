"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">I</span>
            </div>
            <span className="font-bold text-lg">Ikigai</span>
          </div>

          {/* Center - Categories and Search */}
          <div className="hidden md:flex items-center gap-4 flex-1 mx-8">
            <button className="text-sm text-gray-700 hover:text-gray-900">
              Categories
            </button>
            <input
              type="text"
              placeholder="Search courses"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Right - Cart and Auth */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
            </button>
            <Button variant="ghost" size="sm" className="text-gray-700 border-2">
              Log In
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
