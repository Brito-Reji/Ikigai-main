import React from "react";
import {
  ShoppingCart,
  Search,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Footer from "@/components/Footer.jsx";
import CourseCard from "@/components/CourseCard.jsx";

export default function LandingPage() {
  // const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const stats = [
    { number: "250+", label: "Courses by our best mentors" },
    { number: "1000+", label: "Courses by our best mentors" },
    { number: "15+", label: "Courses by our best mentors" },
    { number: "2400+", label: "Courses by our best mentors" },
  ];

  const categories = [
    { icon: "🔬", name: "Astrology", courses: 11 },
    { icon: "💻", name: "Development", courses: 12 },
    { icon: "💼", name: "Marketing", courses: 12 },
    { icon: "⚛️", name: "Physics", courses: 14 },
  ];

  const courses = [
    {
      title: "Beginner's Guide to Design",
      instructor: "Ronald Richards",
      price: "₹149.9",
      rating: 5,
    },
    {
      title: "Beginner's Guide to Design",
      instructor: "Ronald Richards",
      price: "₹149.9",
      rating: 5,
    },
    {
      title: "Beginner's Guide to Design",
      instructor: "Ronald Richards",
      price: "₹149.9",
      rating: 5,
    },
    {
      title: "Beginner's Guide to Design",
      instructor: "Ronald Richards",
      price: "₹149.9",
      rating: 5,
    },
  ];

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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      {/* <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">I</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Ikigai</span>
              </div>
              <a
                href="#"
                className="hidden md:block text-gray-700 hover:text-gray-900"
              >
                Categories
              </a>
            </div>
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-gray-900">
                <ShoppingCart className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Log In
              </button>
              <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav> */}

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
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
                professional growth, and we're here to guide you on your journey
                to success.
              </p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Start your learning journey
              </button>
            </div>
            <div className="relative h-96 hidden md:block">
              <div className="absolute top-0 right-0 w-48 h-48 bg-red-400 rounded-full"></div>
              <div className="absolute top-10 right-48 w-40 h-40 bg-blue-500 rounded-full"></div>
              <div className="absolute bottom-0 right-20 w-56 h-56 bg-yellow-400 rounded-full"></div>
              <div className="absolute top-1/2 left-0 w-12 h-12 bg-gray-900 rounded-full"></div>
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
            <h2 className="text-3xl font-bold text-gray-900">Top Categories</h2>
            <a href="#" className="text-blue-600 hover:text-blue-700">
              See All
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-xl text-center hover:shadow-lg transition cursor-pointer"
              >
                <div className="text-5xl mb-4">{cat.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{cat.name}</h3>
                <p className="text-gray-500 text-sm">{cat.courses} Courses</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Courses */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Top Courses</h2>
            <a href="#" className="text-blue-600 hover:text-blue-700">
              See All
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, idx) => (
              <CourseCard key={idx} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Instructors */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Top Instructors
            </h2>
            <a href="#" className="text-blue-600 hover:text-blue-700">
              See All
            </a>
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
                <p className="text-sm text-gray-600 mb-3">{instructor.role}</p>
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
                Instructors from around the world teach millions of students on
                Ikigai. We provide the tools and skills to teach what you love.
              </p>
              <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                Start Your Instructor Journey →
              </button>
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
  );
}
