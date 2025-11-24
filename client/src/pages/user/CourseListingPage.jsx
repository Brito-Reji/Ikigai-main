"use client";

import { useState, useEffect } from "react";
import {
  Filter,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import CourseCard from "../../components/CourseCard.jsx";
import { useCategory } from "@/hooks/useRedux.js";
import { Link, useSearchParams } from "react-router-dom";
import api from "@/api/axiosConfig.js";

export default function CoursesPage() {
  const { dispatch: categoryDispatch } = useCategory();
  const [searchParams, setSearchParams] = useSearchParams();

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  const [selectedChapters, setSelectedChapters] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const cat = searchParams.get("category");
    return cat ? [cat] : [];
  });
  const [selectedPriceRanges, setSelectedPriceRanges] = useState(() => {
    const price = searchParams.get("priceRange");
    return price ? price.split(",") : [];
  });
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("search") || ""
  );
  const [sortBy, setSortBy] = useState(
    () => searchParams.get("sort") || "newest"
  );
  const [currentPage, setCurrentPage] = useState(
    () => Number(searchParams.get("page")) || 1
  );
  const [expandedSections, setExpandedSections] = useState({
    rating: true,
    chapters: true,
    price: true,
    category: true,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync filters from URL on mount
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    const urlCategory = searchParams.get("category");
    const urlSort = searchParams.get("sort");
    const urlPage = searchParams.get("page");
    const urlPriceRange = searchParams.get("priceRange");

    if (urlSearch) setSearchQuery(urlSearch);
    if (urlCategory) setSelectedCategories([urlCategory]);
    if (urlSort) setSortBy(urlSort);
    if (urlPage) setCurrentPage(Number(urlPage));
    if (urlPriceRange) setSelectedPriceRanges(urlPriceRange.split(","));
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedCategories.length > 0) params.category = selectedCategories[0];
    if (selectedPriceRanges.length > 0)
      params.priceRange = selectedPriceRanges.join(",");
    if (sortBy !== "newest") params.sort = sortBy;
    if (currentPage > 1) params.page = currentPage;

    setSearchParams(params);
  }, [
    searchQuery,
    selectedCategories,
    selectedPriceRanges,
    sortBy,
    currentPage,
    setSearchParams,
  ]);

  // Fetch categories
  const fetchCategoriesData = async () => {
    try {
      const response = await api.get("/public");
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch courses
  const fetchCoursesData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        sort: sortBy,
      });

      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategories.length > 0)
        params.append("category", selectedCategories[0]);
      if (selectedPriceRanges.length > 0)
        params.append("priceRange", selectedPriceRanges.join(","));

      const response = await api.get(`/public/courses?${params.toString()}`);

      if (response.data.success) {
        setCourses(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories on mount
  useEffect(() => {
    fetchCategoriesData();
  }, []);

  // Fetch courses when filters change
  useEffect(() => {
    fetchCoursesData();
  }, [
    searchQuery,
    selectedCategories,
    selectedPriceRanges,
    sortBy,
    currentPage,
  ]);

  // Transform courses for CourseCard component
  const transformedCourses = courses.map(course => ({
    id: course._id,
    title: course.title,
    instructor: course.instructor,
    rating: course.rating || 0,
    hours: course.duration || 0,
    price: `₹${course.price}`,
    thumbnail: course.thumbnail,
    description: course.description,
    category: course.category?.name,
  }));

  function toggleSection(section) {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  }

  function toggleChapter(chapter) {
    if (selectedChapters.includes(chapter)) {
      setSelectedChapters(selectedChapters.filter(c => c !== chapter));
    } else {
      setSelectedChapters([...selectedChapters, chapter]);
    }
  }

  function toggleRating(rating) {
    setCurrentPage(1);
    if (selectedRatings.includes(rating)) {
      setSelectedRatings(selectedRatings.filter(r => r !== rating));
    } else {
      setSelectedRatings([...selectedRatings, rating]);
    }
  }

  function toggleCategory(categoryId) {
    setCurrentPage(1);
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([categoryId]);
    }
  }

  function togglePriceRange(range) {
    setCurrentPage(1);
    if (selectedPriceRanges.includes(range)) {
      setSelectedPriceRanges(selectedPriceRanges.filter(r => r !== range));
    } else {
      setSelectedPriceRanges([...selectedPriceRanges, range]);
    }
  }

  function clearAllFilters() {
    setSelectedChapters([]);
    setSelectedRatings([]);
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSearchQuery("");
    setSortBy("newest");
    setSearchParams({});
    setCurrentPage(1);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - Removed max-w-7xl to use full width */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            All Courses
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {loading
              ? "Loading courses..."
              : `${pagination.totalCourses || 0} courses available`}
          </p>
        </div>

        {/* Filter and Sort Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition w-full sm:w-auto justify-center sm:justify-start lg:hidden"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter</span>
            </button>
            {(selectedCategories.length > 0 ||
              selectedRatings.length > 0 ||
              selectedPriceRanges.length > 0 ||
              searchQuery) && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Clear all filters
              </button>
            )}
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-sm text-gray-600">Sort By</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="title-asc">Title: A-Z</option>
              <option value="title-desc">Title: Z-A</option>
            </select>
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
                    {[5, 4, 3, 2, 1].map(rating => (
                      <label
                        key={rating}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedRatings.includes(rating)}
                          onChange={() => toggleRating(rating)}
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
                          <span className="ml-2 text-sm text-gray-600">
                            & up
                          </span>
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
                    {["1-10", "10-15", "15-20", "20-25"].map(range => (
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
                  className="flex justify-between items-center w-full mb-4"
                >
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Price Range
                  </h3>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedSections.price ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedSections.price && (
                  <div className="space-y-2">
                    {[
                      { label: "Free", value: "free" },
                      { label: "Under ₹500", value: "0-500" },
                      { label: "₹500 - ₹1000", value: "500-1000" },
                      { label: "₹1000 - ₹2000", value: "1000-2000" },
                      { label: "Above ₹2000", value: "2000+" },
                    ].map(range => (
                      <label
                        key={range.value}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="rounded text-blue-600"
                          checked={selectedPriceRanges.includes(range.value)}
                          onChange={() => togglePriceRange(range.value)}
                        />
                        <span className="text-gray-700 text-sm">
                          {range.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Filter */}
              <div className="bg-white lg:bg-transparent rounded-lg p-4 lg:p-0">
                <button
                  onClick={() => toggleSection("category")}
                  className="flex justify-between items-center w-full mb-4"
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
                {expandedSections.category && (
                  <div className="space-y-2">
                    {categories.map(category => (
                      <label
                        key={category._id}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="rounded text-blue-600"
                          checked={selectedCategories.includes(category._id)}
                          onChange={() => toggleCategory(category._id)}
                        />
                        <span className="text-gray-700 text-sm">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="flex-1 w-full">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200 animate-pulse rounded-lg h-64"
                  ></div>
                ))}
              </div>
            ) : transformedCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                {transformedCourses.map((course, idx) => (
                  <>
                    <Link to={`/course/${course.id}`} key={course.id || idx}>
                      <CourseCard course={course} />
                    </Link>
                  </>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  {searchQuery ||
                  selectedCategories.length > 0 ||
                  selectedRatings.length > 0
                    ? "No courses match your filters."
                    : "No courses available at the moment."}
                </p>
                {(searchQuery ||
                  selectedCategories.length > 0 ||
                  selectedRatings.length > 0) && (
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-1 sm:space-x-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={!pagination.hasPrev}
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg transition shrink-0 text-sm ${
                        currentPage === pageNum
                          ? "bg-gray-900 text-white hover:bg-gray-800"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage(
                      Math.min(pagination.totalPages, currentPage + 1)
                    )
                  }
                  disabled={!pagination.hasNext}
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
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
