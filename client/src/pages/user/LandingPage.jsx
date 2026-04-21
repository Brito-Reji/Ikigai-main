import React, { useEffect, useRef, useState } from "react";
import { Star, ArrowRight, Play, Users, BookOpen, Award, TrendingUp } from "lucide-react";
import Footer from "@/components/layout/Footer.jsx";
import CourseCard from "@/components/student/CourseCard.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useFeaturedCourses } from "@/hooks/useCourses.js";
import { useCategories } from "@/hooks/useCategories.js";

import bannerOne from "../../assets/images/banner/one.png";
import bannerTwo from "../../assets/images/banner/two.png";
import bannerThree from "../../assets/images/banner/three.png";

// animated counter
function CountUp({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const num = parseInt(target.replace(/\D/g, ""), 10);
          const duration = 1500;
          const steps = 60;
          const inc = num / steps;
          let cur = 0;
          const timer = setInterval(() => {
            cur += inc;
            if (cur >= num) {
              setCount(num);
              clearInterval(timer);
            } else {
              setCount(Math.floor(cur));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

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

const stats = [
  { number: "250+", label: "Expert Courses", icon: BookOpen },
  { number: "1000+", label: "Happy Students", icon: Users },
  { number: "15+", label: "Categories", icon: TrendingUp },
  { number: "2400+", label: "Certificates Issued", icon: Award },
];

const testimonials = [
  {
    name: "Arjun Sharma",
    role: "@arjunsharma",
    text: "Ikigai's tech courses are top-notch! The up-to-date content and engaging multimedia helped me land my first dev job within 3 months.",
  },
  {
    name: "Priya Nair",
    role: "@priyanair",
    text: "The instructors are world-class and the platform is so intuitive. I completed my data science course in record time.",
  },
  {
    name: "Rohit Mehta",
    role: "@rohitmehta",
    text: "Best investment I've made. The certificate helped me get a 40% salary hike. Absolutely recommend Ikigai to everyone.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { data: featuredData, isLoading: featuredLoading } = useFeaturedCourses({ limit: 4 });
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

  const featuredCourses = featuredData?.data || [];
  const categories = categoriesData?.categories || [];

  const courses = featuredCourses.map((course) => ({
    id: course._id,
    title: course.title,
    instructor: course.instructor,
    price: `₹${course.price}`,
    rating: course.rating || 0,
    thumbnail: course.thumbnail,
    description: course.description,
    category: course.category?.name,
  }));

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(99,102,241,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(99,102,241,0); }
        }
        .float { animation: float 4s ease-in-out infinite; }
        .float-delay { animation: float-delay 5s ease-in-out infinite 1s; }
        .float-slow { animation: float 6s ease-in-out infinite 0.5s; }
        .fade-in-up { animation: fadeInUp 0.7s ease forwards; }
        .fade-in-up-1 { animation: fadeInUp 0.7s ease 0.1s forwards; opacity: 0; }
        .fade-in-up-2 { animation: fadeInUp 0.7s ease 0.25s forwards; opacity: 0; }
        .fade-in-up-3 { animation: fadeInUp 0.7s ease 0.4s forwards; opacity: 0; }
        .pulse-btn { animation: pulse-ring 2s ease infinite; }
        .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <div className="min-h-screen bg-white overflow-x-hidden">

        {/* Hero */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
          {/* Background blobs */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-60" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full translate-x-1/3 translate-y-1/3 opacity-60" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="fade-in-up inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
                  🚀 Over 1000+ students learning daily
                </span>
                <h1 className="fade-in-up-1 text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Unlock Your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    Potential
                  </span>
                  <br />
                  with Ikigai
                </h1>
                <p className="fade-in-up-2 text-gray-600 mb-8 text-lg leading-relaxed">
                  Join thousands of learners who are transforming their careers. Expert-led courses, 
                  real-world projects, and a community that grows together.
                </p>
                <div className="fade-in-up-3 flex flex-wrap gap-4">
                  <Link to="/signup">
                    <button className="pulse-btn px-7 py-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold text-base flex items-center gap-2 shadow-lg shadow-indigo-200">
                      Start Learning Free
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link to="/courses" target="_blank">
                    <button className="px-7 py-3.5 border-2 border-gray-200 text-gray-700 rounded-xl hover:border-indigo-400 hover:text-indigo-600 transition font-semibold text-base flex items-center gap-2">
                      <Play className="w-4 h-4 fill-current" />
                      Browse Courses
                    </button>
                  </Link>
                </div>
              </div>

              {/* Floating image bubbles */}
              <div className="relative h-96 hidden md:block">
                <div
                  className="float absolute top-0 right-0 w-52 h-52 rounded-full shadow-xl overflow-hidden border-4 border-white"
                  style={{ backgroundImage: `url(${bannerOne})`, backgroundSize: "cover", backgroundPosition: "center" }}
                />
                <div
                  className="float-delay absolute top-12 right-52 w-44 h-44 rounded-full shadow-xl overflow-hidden border-4 border-white"
                  style={{ backgroundImage: `url(${bannerTwo})`, backgroundSize: "cover", backgroundPosition: "center" }}
                />
                <div
                  className="float-slow absolute bottom-0 right-24 w-48 h-48 rounded-full shadow-xl overflow-hidden border-4 border-white"
                  style={{ backgroundImage: `url(${bannerThree})`, backgroundSize: "cover", backgroundPosition: "center" }}
                />
                {/* Floating badges */}
                <div className="float absolute top-8 left-0 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">✓</div>
                  <div>
                    <p className="text-xs text-gray-500">Enrolled today</p>
                    <p className="text-sm font-semibold text-gray-800">+48 students</p>
                  </div>
                </div>
                <div className="float-delay absolute bottom-16 left-0 bg-white rounded-2xl shadow-lg px-4 py-3">
                  <p className="text-xs text-gray-500 mb-1">Avg. Rating</p>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                    <span className="text-sm font-bold text-gray-800 ml-1">4.9</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-14 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                const numStr = stat.number.replace(/\D/g, "");
                const suffix = stat.number.replace(/\d/g, "");
                return (
                  <div key={idx} className="text-center group">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-100 transition-colors">
                      <Icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                      <CountUp target={stat.number} suffix={suffix} />
                    </h3>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore Top Categories</h2>
                <p className="text-gray-500">Find courses in your favourite field</p>
              </div>
              <Link to="/courses" target="_blank" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium group">
                See All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {categoriesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => <div key={i} className="shimmer rounded-2xl h-40" />)}
              </div>
            ) : categories.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.slice(0, 4).map((cat, idx) => (
                  <Link
                    key={cat._id}
                    to={`/courses?category=${cat._id}`}
                    target="_blank"
                    className="card-hover group relative overflow-hidden bg-white rounded-2xl p-6 border border-gray-100 cursor-pointer"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradients[idx % gradients.length]} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    <div className="relative z-10">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[idx % gradients.length]} mb-4 flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300`}>
                        {cat.name.charAt(0).toUpperCase()}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1 text-lg group-hover:text-indigo-600 transition-colors">{cat.name}</h3>
                      <p className="text-gray-400 text-sm">{cat.courseCount || 0} {cat.courseCount === 1 ? "Course" : "Courses"}</p>
                    </div>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-indigo-600" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl">
                <p className="text-gray-400">No categories yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Featured Courses */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Top Courses</h2>
                <p className="text-gray-500">Handpicked by our team</p>
              </div>
              <Link to="/courses" target="_blank" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium group">
                See All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {featuredLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => <div key={i} className="shimmer rounded-xl h-64" />)}
              </div>
            ) : courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {courses.map((course, idx) => (
                  <Link to={`/course/${course.id}`} target="_blank" key={course.id || idx} className="card-hover block">
                    <CourseCard course={course} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No courses at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">What Our Students Say</h2>
              <p className="text-gray-500">Real stories from real learners</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, idx) => (
                <div key={idx} className="card-hover bg-white p-7 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-4xl text-indigo-400 leading-none mb-4">"</div>
                  <p className="text-gray-700 mb-6 leading-relaxed">{t.text}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{t.name}</h4>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                    <div className="ml-auto flex">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Become Instructor */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-56 h-56 bg-white/10 rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-white/5 rounded-full" />
              <div className="flex-1 relative z-10">
                <span className="text-white/70 text-sm font-medium uppercase tracking-wider">For Educators</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">Become an Instructor</h2>
                <p className="text-white/80 mb-8 leading-relaxed max-w-lg">
                  Share your expertise with thousands of eager learners. Build your audience, earn income, and make an impact.
                </p>
                <Link to="/instructor/signup">
                  <button className="px-7 py-3.5 bg-white text-indigo-700 rounded-xl hover:bg-indigo-50 transition font-semibold flex items-center gap-2 shadow-lg">
                    Start Teaching Today
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
              <div className="relative z-10 flex flex-col gap-4">
                {[
                  { icon: "💰", label: "Earn on your schedule" },
                  { icon: "🌍", label: "Reach global students" },
                  { icon: "📈", label: "Grow your brand" },
                ].map((item, i) => (
                  <div key={i} className="card-hover flex items-center gap-3 bg-white/15 backdrop-blur rounded-xl px-5 py-3 text-white cursor-default">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Transform CTA */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to transform your life?
            </h2>
            <p className="text-gray-500 mb-8 text-lg">
              Learners around the world are launching new careers and advancing in their fields.
            </p>
            <Link to="/courses" target="_blank">
              <button className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold text-base shadow-lg shadow-indigo-200 flex items-center gap-2 mx-auto">
                Explore All Courses
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
