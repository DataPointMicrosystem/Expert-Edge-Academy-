import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { COURSES } from "../data/courses";
import { useCart } from "../context/CartContext";

function StarRating({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  const s = size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          className={s}
          viewBox="0 0 16 16"
          fill={n <= Math.floor(rating) ? "#F5A623" : "#E5E7EB"}
        >
          <path d="M8 1l1.796 3.64L14 5.382l-3 2.923.708 4.131L8 10.348l-3.708 2.088L5 8.305 2 5.382l4.204-.742L8 1z" />
        </svg>
      ))}
    </span>
  );
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const course = COURSES.find((c) => c.id === id);
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<number | null>(0);
  const inCart = course ? isInCart(course.id) : false;

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F8F5]">
        <div className="text-center">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="font-display font-bold text-2xl text-[#1B1F3B] mb-2">
            Course not found
          </h2>
          <Link to="/" className="text-[#F5A623] font-semibold hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  const discount = Math.round((1 - course.price / course.originalPrice) * 100);
  const totalLectures = course.sections.reduce(
    (sum, s) => sum + s.lectures.length,
    0,
  );

  const handleBuyNow = () => {
    addToCart(course);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-[#F9F8F5]">
      {/* Course hero */}
      <section className="bg-linear-to-br from-[#1B1F3B] to-[#2a2f50] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid lg:grid-cols-3 gap-10">
          {/* Left: Course info */}
          <div className="lg:col-span-2">
            <nav className="flex items-center gap-2 text-xs text-white/50 mb-4">
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="hover:text-white cursor-pointer transition-colors">
                {course.category}
              </span>
              <span>/</span>
              <span className="text-white/80 line-clamp-1">{course.title}</span>
            </nav>

            {course.badge && (
              <span
                className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full mb-4 ${
                  course.badge === "Bestseller"
                    ? "bg-[#F5A623] text-[#1B1F3B]"
                    : course.badge === "Hot"
                      ? "bg-red-500 text-white"
                      : "bg-white/20 text-white"
                }`}
              >
                {course.badge}
              </span>
            )}

            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl leading-tight mb-4">
              {course.title}
            </h1>
            <p className="text-white/70 text-base mb-5 max-w-2xl leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="text-[#F5A623] font-bold">
                  {course.rating}
                </span>
                <StarRating rating={course.rating} size="md" />
                <span className="text-white/50 text-sm">
                  ({course.reviews.toLocaleString()} ratings)
                </span>
              </div>
              <span className="text-white/50 text-sm">
                {course.enrolled.toLocaleString()} students
              </span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <img
                src={`https://images.unsplash.com/${course.instructorAvatar}?w=40&h=40&fit=crop&auto=format`}
                alt={course.instructor}
                className="w-8 h-8 rounded-full border-2 border-white/30 object-cover"
              />
              <span className="text-sm">
                Created by{" "}
                <span className="text-[#F5A623] font-semibold underline underline-offset-2 cursor-pointer">
                  {course.instructor}
                </span>
              </span>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/60">
              <span>🌐 {course.language}</span>
              <span>📅 Last updated {course.lastUpdated}</span>
              <span>🎥 {course.hours} hours on-demand video</span>
              <span>📝 {totalLectures} lectures</span>
              <span>📶 {course.level}</span>
              <span>♾️ Full lifetime access</span>
              <span>📱 Access on mobile and desktop</span>
              <span>🏆 Certificate of completion</span>
            </div>
          </div>

          {/* Right: Purchase card (desktop sticky) */}
          <div className="hidden lg:block">
            <div className="sticky top-20 bg-white rounded-2xl shadow-2xl overflow-hidden text-gray-900">
              <div className="relative">
                <img
                  src={`https://images.unsplash.com/${course.image}?w=400&h=220&fit=crop&auto=format`}
                  alt={course.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg cursor-pointer hover:bg-white transition-colors">
                    <svg
                      className="w-6 h-6 text-[#1B1F3B] ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                  Preview this course
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="font-display font-black text-3xl text-[#1B1F3B]">
                    ${course.price}
                  </span>
                  <span className="text-gray-400 line-through text-base">
                    ${course.originalPrice}
                  </span>
                  <span className="text-green-600 font-bold text-sm">
                    {discount}% off
                  </span>
                </div>
                <p className="text-xs text-red-500 font-semibold mb-4">
                  ⏳ 2 days left at this price!
                </p>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 rounded-xl bg-[#F5A623] text-[#1B1F3B] font-bold text-sm hover:opacity-90 transition-opacity mb-2 shadow-md"
                >
                  Buy now
                </button>
                <button
                  onClick={() => addToCart(course)}
                  disabled={inCart}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm border-2 transition-all ${
                    inCart
                      ? "border-green-200 bg-green-50 text-green-700 cursor-default"
                      : "border-[#1B1F3B] text-[#1B1F3B] hover:bg-[#1B1F3B] hover:text-white"
                  }`}
                >
                  {inCart ? "✓ Added to cart" : "Add to cart"}
                </button>

                <p className="text-[10px] text-gray-400 text-center mt-3">
                  30-Day Money-Back Guarantee
                </p>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-700 mb-2">
                    This course includes:
                  </p>
                  <ul className="flex flex-col gap-1.5 text-xs text-gray-500">
                    <li>🎥 {course.hours} hours on-demand video</li>
                    <li>📁 Downloadable resources</li>
                    <li>📱 Access on mobile & desktop</li>
                    <li>♾️ Full lifetime access</li>
                    <li>🏆 Certificate of completion</li>
                  </ul>
                </div>

                <div className="flex gap-2 mt-4 text-xs text-[#1B1F3B] font-semibold justify-center">
                  <button className="hover:underline">Share</button>
                  <span className="text-gray-300">|</span>
                  <button className="hover:underline">Gift this course</button>
                  <span className="text-gray-300">|</span>
                  <button className="hover:underline">Apply coupon</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile purchase bar */}
      <div className="lg:hidden sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <span className="font-display font-black text-xl text-[#1B1F3B]">
            ${course.price}
          </span>
          <span className="text-xs text-gray-400 line-through ml-2">
            ${course.originalPrice}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => addToCart(course)}
            disabled={inCart}
            className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${inCart ? "border-green-200 text-green-700" : "border-[#1B1F3B] text-[#1B1F3B] hover:bg-[#1B1F3B] hover:text-white"}`}
          >
            {inCart ? "✓ In cart" : "Add to cart"}
          </button>
          <button
            onClick={handleBuyNow}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F5A623] text-[#1B1F3B] hover:opacity-90"
          >
            Buy now
          </button>
        </div>
      </div>

      {/* Course content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 flex flex-col gap-10">
          {/* What you'll learn */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-display font-bold text-xl text-[#1B1F3B] mb-4">
              What you'll learn
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {course.whatYoullLearn.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#F5A623]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      className="w-3 h-3 text-[#c47a00]"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700 leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h2 className="font-display font-bold text-xl text-[#1B1F3B] mb-4">
              Requirements
            </h2>
            <ul className="flex flex-col gap-2">
              {course.requirements.map((r) => (
                <li
                  key={r}
                  className="flex items-center gap-3 text-sm text-gray-600"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Course content / sections */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-xl text-[#1B1F3B]">
                Course content
              </h2>
              <span className="text-xs text-gray-400">
                {course.sections.length} sections · {totalLectures} lectures ·{" "}
                {course.hours}h total
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {course.sections.map((section, si) => (
                <div
                  key={si}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedSection(expandedSection === si ? null : si)
                    }
                    className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                  >
                    <div>
                      <p className="font-semibold text-sm text-[#1B1F3B]">
                        {section.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {section.lectures.length} lectures
                      </p>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${expandedSection === si ? "rotate-180" : ""}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {expandedSection === si && (
                    <div className="divide-y divide-gray-100">
                      {section.lectures.map((lecture) => (
                        <div
                          key={lecture.id}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                            {lecture.type === "quiz" ? (
                              <span className="text-xs">📝</span>
                            ) : (
                              <svg
                                className="w-3.5 h-3.5 text-gray-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <p
                              className={`text-sm ${lecture.completed ? "text-gray-400 line-through" : "text-gray-700"}`}
                            >
                              {lecture.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {lecture.free && (
                              <span className="text-[10px] font-bold text-[#1B1F3B] bg-[#F5A623]/20 px-2 py-0.5 rounded-full">
                                Preview
                              </span>
                            )}
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                              {lecture.duration}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructor */}
          <div>
            <h2 className="font-display font-bold text-xl text-[#1B1F3B] mb-5">
              Your instructor
            </h2>
            <div className="flex items-start gap-5 bg-white rounded-2xl p-6 border border-gray-100">
              <img
                src={`https://images.unsplash.com/${course.instructorAvatar}?w=80&h=80&fit=crop&auto=format`}
                alt={course.instructor}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#F5A623]/40 shrink-0"
              />
              <div>
                <h3 className="font-display font-bold text-lg text-[#1B1F3B]">
                  {course.instructor}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  {course.category} Expert & Instructor
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
                  <span>⭐ {course.rating} Instructor Rating</span>
                  <span>
                    👥{" "}
                    {(course.enrolled * 1.4)
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                    Students
                  </span>
                  <span>🎥 {course.sections.length * 3}+ Courses</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {course.instructor} is a senior{" "}
                  {course.category.toLowerCase()} professional with 10+ years of
                  industry experience. Known for practical, project-based
                  teaching that gets students real results fast.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar spacer on desktop */}
        <div className="hidden lg:block" />
      </div>

      {/* Access course CTA (if enrolled) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-linear-to-r from-[#1B1F3B] to-[#2d3360] text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="font-display font-bold text-xl mb-1">
              Ready to start learning?
            </h3>
            <p className="text-white/60 text-sm">
              Join {course.enrolled.toLocaleString()} students already enrolled.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleBuyNow}
              className="px-6 py-3 rounded-xl bg-[#F5A623] text-[#1B1F3B] font-bold text-sm hover:opacity-90 transition-opacity shadow-md"
            >
              Enroll now — ${course.price}
            </button>
            <Link
              to={`/courses/${course.id}/learn`}
              className="px-6 py-3 rounded-xl border border-white/25 font-bold text-sm hover:bg-white/10 transition-colors"
            >
              Preview for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
