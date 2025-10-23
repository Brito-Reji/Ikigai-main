"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function InstructorCTA() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="relative h-96 hidden md:block">
            <div className="w-64 h-64 mx-auto bg-purple-300 rounded-3xl flex items-center justify-center">
              <Image
                src="/man-instructor-portrait.jpg"
                alt="Instructor"
                width={256}
                height={256}
                className="rounded-3xl"
              />
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Become an Instructor
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Instructors from around the world teach millions of students on
              Ikigai. We provide the tools and skills to teach what you love.
            </p>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-base">
              Start Your Instructor Journey →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
