import React, { useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer.jsx";
import CourseCard from "@/components/CourseCard.jsx";
import { Link } from "react-router-dom";
import { useCourse, useCategory } from "@/hooks/useRedux.js";
import { fetchFeaturedCourses } from "@/store/slices/courseSlice.js";
import { fetchCategories } from "@/store/slices/categorySlice";

import bannerOne from "../../assets/images/banner/one.png";
import bannerTwo from "../../assets/images/banner/two.png";

export default function LandingPage() {
  const {
    featuredCourses,
    featuredLoading,
    featuredError,
    dispatch: courseDispatch,
  } = useCourse();
  const categoryState = useCategory();
  const {
    categories,
    loading: categoriesLoading,
    dispatch: categoryDispatch,
  } = categoryState;

  console.log("Category state:", categoryState);
  console.log("Categories array:", categories);

  // Fetch featured courses and categories on component mount
  useEffect(() => {
    courseDispatch(fetchFeaturedCourses({ limit: 4 }));
    categoryDispatch(fetchCategories());
  }, [courseDispatch, categoryDispatch]);

  const stats = [
    { number: "250+", label: "Courses by our best mentors" },
    { number: "1000+", label: "Courses by our best mentors" },
    { number: "15+", label: "Courses by our best mentors" },
    { number: "2400+", label: "Courses by our best mentors" },
  ];

  // Gradient colors for categories
  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-green-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-cyan-500 to-blue-600",
    "from-yellow-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-emerald-500 to-green-600",
  ];

  // Transform featured courses data for CourseCard component
  const courses = featuredCourses.map(course => ({
    id: course._id,
    title: course.title,
    instructor: course.instructor, // Pass the whole instructor object
    price: `₹${course.price}`,
    rating: course.rating || 0,
    thumbnail: course.thumbnail,
    description: course.description,
    category: course.category?.name,
  }));

  const instructors = [
    {
      name: "Ronald Richards",
      role: "UI/UX Designer",
      rating: 4.9,
      students: 2400,
    },
    {
      name: "Ronald Richards",
      role: "UI/UX Designer",
      rating: 4.9,
      students: 2400,
    },
    {
      name: "Rothis a   testnald Richards",
      role: "UI/UX Designer",
      rating: 4.9,
      students: 2400,
    },
    {
      name: "Ronald Richards",
      role: "UI/UX Designer",
      rating: 4.9,
      students: 2400,
    },
    {
      name: "Ronald Richards",
      role: "UI/UX Designer",
      rating: 4.9,
      students: 2400,
    },
  ];

  const testimonials = [
    {
      name: "Jane Doe",
      role: "@janedoe",
      text: "Ikigai's tech courses are top-notch! As someone who's always looking to stay ahead in the rapidly evolving tech world, I appreciate the up-to-date content and engaging multimedia.",
    },
    {
      name: "Jane Doe",
      role: "@janedoe",
      text: "Ikigai's tech courses are top-notch! As someone who's always looking to stay ahead in the rapidly evolving tech world, I appreciate the up-to-date content and engaging multimedia.",
    },
    {
      name: "Jane Doe",
      role: "@janedoe",
      text: "Ikigai's tech courses are top-notch! As someone who's always looking to stay ahead in the rapidly evolving tech world, I appreciate the up-to-date content and engaging multimedia.",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="py-16 bg-linear-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Unlock Your Potential
                  <br />
                  with Ikigai
                </h1>
                <p className="text-gray-600 mb-8 text-lg">
                  Welcome to Ikigai, your gateway to knowledge and growth on
                  Ukigai. We believe that education is the key to personal and
                  professional growth, and we're here to guide you on your
                  journey to success.
                </p>
                <Link to={"/signup"}>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Start your learning journey
                  </button>
                </Link>
              </div>
              <div className="relative h-96 hidden md:block">
                <div
                  className="absolute top-0 right-0 w-48 h-48 bg-red-400 rounded-full"
                  style={{
                    backgroundImage: `url(${bannerOne})`,
                    backgroundPosition: "-17px 0px",
                    backgroundSize: "200px",
                  }}
                ></div>
                <div
                  className="absolute top-10 right-48 w-48 h-48 bg-blue-500 rounded-full"
                  style={{
                    backgroundImage: `url(${bannerTwo})`,
                    backgroundPosition: "-17px 0px",
                    backgroundSize: "200px",
                  }}
                ></div>
                <div
                  className="absolute bottom-0 right-24 w-48 h-48 bg-yellow-400 rounded-full"
                  style={{
                    backgroundImage: `url(${bannerOne})`,
                    backgroundPosition: "-17px 0px",
                    backgroundSize: "200px",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </h3>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Categories */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Explore Top Categories
                </h2>
                <p className="text-gray-600">
                  Discover courses across various fields
                </p>
              </div>
              <Link
                to={"/courses"}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium group"
              >
                See All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {categoriesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="bg-gray-200 animate-pulse rounded-2xl h-40"
                  ></div>
                ))}
              </div>
            ) : categories && categories.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.slice(0, 4).map((cat, idx) => (
                  <Link
                    key={cat._id}
                    to={`/course?category=${cat._id}`}
                    className="group relative overflow-hidden bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
                  >
                    {/* Gradient background on hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${gradients[idx % gradients.length]} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    ></div>

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Decorative element */}
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[idx % gradients.length]} mb-4 flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300`}
                      >
                        {cat.name.charAt(0).toUpperCase()}
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-2 text-lg group-hover:text-blue-600 transition-colors">
                        {cat.name}
                      </h3>

                      <p className="text-gray-500 text-sm">
                        {cat.courseCount || 0}{" "}
                        {cat.courseCount === 1 ? "Course" : "Courses"}
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-blue-600" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl">
                <p className="text-gray-500">
                  No categories available at the moment.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Top Courses */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Top Courses</h2>
              <Link
                to={"/course"}
                className="text-blue-600 hover:text-blue-700"
              >
                See All
              </Link>
            </div>
            {featuredLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="bg-gray-200 animate-pulse rounded-lg h-64"
                  ></div>
                ))}
              </div>
            ) : featuredError ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">
                  Error loading courses: {featuredError}
                </p>
                <button
                  onClick={() => dispatch(fetchFeaturedCourses({ limit: 4 }))}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {courses.map((course, idx) => (
                  <CourseCard key={course.id || idx} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No courses available at the moment.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Top Instructors */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Top Instructors
              </h2>
              <Link
                to={"/course"}
                className="text-blue-600 hover:text-blue-700"
              >
                See All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {instructors.map((instructor, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl text-center hover:shadow-lg transition cursor-pointer"
                >
                  <div className="w-24 h-24 bg-green-200 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {instructor.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {instructor.role}
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{instructor.rating}</span>
                    </div>
                    <span className="text-gray-600">
                      {instructor.students} Students
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              What Our Customer Say
            </h2>
            <p className="text-gray-600 mb-8">About Us</p>
            <div className="relative">
              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, idx) => (
                  <div key={idx} className="bg-blue-50 p-6 rounded-xl">
                    <div className="text-4xl text-blue-600 mb-4">"</div>
                    <p className="text-gray-700 mb-6">{testimonial.text}</p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-yellow-400 rounded-full mr-3"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-400">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-400">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Become Instructor */}
        <section className="py-16 bg-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="w-64 h-96 bg-purple-200 rounded-full mx-auto"></div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Become an Instructor
                </h2>
                <p className="text-gray-700 mb-6">
                  Instructors from around the world teach millions of students
                  on Ikigai. We provide the tools and skills to teach what you
                  love.
                </p>
                <Link to={"/instructor/signup"}>
                  <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                    Start Your Instructor Journey →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Transform Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Transform your life through education
                </h2>
                <p className="text-gray-700 mb-6">
                  Learners around the world are launching new careers, advancing
                  in their fields, and enriching their lives.
                </p>
                <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                  Checkout Courses →
                </button>
              </div>
              <div className="w-full h-96 bg-blue-200 rounded-3xl"></div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
