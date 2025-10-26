"use client";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
// import img from "next/img";

export default function Hero() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Unlock Your Potential with Ikigai
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Discover a world of knowledge on topics. We believe that education
              is the key to personal and professional growth, and we're here to
              guide you on your journey to success.
            </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base">
            <Link to={'/signup'}>
                Start your learning journey
            </Link>
              </Button>
          </div>

          {/* Right - Profile Circles */}
          <div className="relative h-96 hidden md:block">
            {/* Blue circle - top right */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-36 h-36 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <img
                  src="/man-with-cap-smiling.jpg"
                  alt="Student"
                  width={140}
                  height={140}
                  className="rounded-full"
                />
              </div>
            </div>

            {/* Red circle - middle left */}
            <div className="absolute top-20 left-0 w-36 h-36 bg-red-400 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-32 h-32 bg-gradient-to-br from-red-300 to-red-500 rounded-full flex items-center justify-center">
                <img
                  src="/woman-with-red-jacket.jpg"
                  alt="Student"
                  width={128}
                  height={128}
                  className="rounded-full"
                />
              </div>
            </div>

            {/* Yellow circle - bottom right */}
            <div className="absolute bottom-0 right-12 w-40 h-40 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-36 h-36 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <img
                    src="/woman-with-colorful-background.jpg"
                    alt="Student"
                    width={140}
                    height={140}
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Badge */}
            <div className="absolute bottom-8 left-8 bg-white rounded-full px-4 py-2 shadow-lg text-sm font-semibold">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-gray-400 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-gray-500 rounded-full border-2 border-white"></div>
                </div>
                <span>100k+ Students</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
