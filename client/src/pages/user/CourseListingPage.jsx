"use client";

import { useState } from "react";
import {
  Filter,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import Header from "../../components/Header.jsx";
import CourseCard from "../../components/CourseCard.jsx";

export default function CoursesPage() {
  const [selectedChapters, setSelectedChapters] = useState(["15-20"]);
  const [expandedSections, setExpandedSections] = useState({
    rating: true,
    chapters: true,
    price: false,
    category: false,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function toggleSection(section) {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  }

  function toggleChapter(chapter) {
    if (selectedChapters.includes(chapter)) {
      setSelectedChapters(selectedChapters.filter((c) => c !== chapter));
    } else {
      setSelectedChapters([...selectedChapters, chapter]);
    }
  }

  const courses = Array(15).fill({
    title: "Beginner's Guide to Design",
    instructor: "Ronald Richards",
    rating: 5,
    hours: 22,
    price: "₹149.9",
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&q=80",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - Removed max-w-7xl to use full width */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Design Courses
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            All Development Courses
          </p>
        </div>

        {/* Filter and Sort Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition w-full sm:w-auto justify-center sm:justify-start">
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filter</span>
          </button>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-sm text-gray-600">Sort By</span>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex-1 sm:flex-none justify-between sm:justify-start">
              <span className="text-sm">Relevance</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Filters - Mobile Overlay */}
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${
              sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar Filters */}
          <div
            className={`fixed left-0 top-0 h-full w-64 bg-white z-40 transform transition-transform duration-300 lg:relative lg:w-64 lg:transform-none lg:top-auto lg:h-auto lg:bg-transparent lg:z-auto overflow-y-auto ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }`}
          >
            <div className="p-4 lg:p-0 space-y-4">
              {/* Close Button for Mobile */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden mb-4 p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Rating Filter */}
              <div className="bg-white lg:bg-transparent rounded-lg p-4 lg:p-0 lg:mb-0 mb-4">
                <button
                  onClick={() => toggleSection("rating")}
                  className="flex justify-between items-center w-full mb-4"
                >
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Rating
                  </h3>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedSections.rating ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedSections.rating && (
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <label
                        key={rating}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="rounded"
                          defaultChecked={rating === 5}
                        />
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Number of Chapters Filter */}
              <div className="bg-white lg:bg-transparent rounded-lg p-4 lg:p-0 lg:mb-0 mb-4">
                <button
                  onClick={() => toggleSection("chapters")}
                  className="flex justify-between items-center w-full mb-4"
                >
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Number of Chapters
                  </h3>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedSections.chapters ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedSections.chapters && (
                  <div className="space-y-2">
                    {["1-10", "10-15", "15-20", "20-25"].map((range) => (
                      <label
                        key={range}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="rounded text-blue-600"
                          checked={selectedChapters.includes(range)}
                          onChange={() => toggleChapter(range)}
                        />
                        <span className="text-gray-700 text-sm">{range}</span>
                      </label>
                    ))}
                    <button className="text-blue-600 text-sm flex items-center space-x-1 mt-2 hover:text-blue-700 transition">
                      <span>See More</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div className="bg-white lg:bg-transparent rounded-lg p-4 lg:p-0 lg:mb-0 mb-4">
                <button
                  onClick={() => toggleSection("price")}
                  className="flex justify-between items-center w-full"
                >
                  <h3 className="font-semibold text-gray-900 text-sm">Price</h3>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedSections.price ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Category Filter */}
              <div className="bg-white lg:bg-transparent rounded-lg p-4 lg:p-0">
                <button
                  onClick={() => toggleSection("category")}
                  className="flex justify-between items-center w-full"
                >
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Category
                  </h3>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedSections.category ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {courses.map((course, idx) => (
                <CourseCard key={idx} course={course} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-1 sm:space-x-2 overflow-x-auto pb-2">
              <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition flex-shrink-0">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition flex-shrink-0 text-sm">
                1
              </button>
              <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition flex-shrink-0 text-sm">
                2
              </button>
              <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition flex-shrink-0 text-sm">
                3
              </button>
              <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition flex-shrink-0">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 mt-12 sm:mt-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">I</span>
                </div>
                <span className="text-lg font-bold">Ikigai</span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Empowering learners through accessible and engaging online
                education. Ikigai is a leading learning platform dedicated to
                providing high-quality, flexible, and affordable educational
                experiences.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm">Get Help</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Latest Articles
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm">Programs</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Art & Design
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Business
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    IT & Software
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Languages
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Programming
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm">Contact Us</h3>
              <p className="text-xs sm:text-sm text-gray-400 mb-2">
                Address: 123 Main Street, Anytown, CA 12345
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mb-4">
                Tel: +123 456 7890
                <br />
                Mail: ikigai@web.in
              </p>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition text-xs font-bold"
                >
                  f
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition text-xs font-bold"
                >
                  in
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition text-xs font-bold"
                >
                  G
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition text-xs font-bold"
                >
                  X
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition text-xs font-bold"
                >
                  M
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
