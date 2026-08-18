import { useState } from "react";
import { Link } from "react-router";
import { useCart } from "../context/CartContext";
import type { Course } from "../data/courses";

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className="w-3 h-3" viewBox="0 0 16 16"
          fill={s <= Math.floor(rating) ? "#F5A623" : s - 0.5 <= rating ? "url(#half-c)" : "#E5E7EB"}>
          <defs>
            <linearGradient id="half-c">
              <stop offset="50%" stopColor="#F5A623" />
              <stop offset="50%" stopColor="#E5E7EB" />
            </linearGradient>
          </defs>
          <path d="M8 1l1.796 3.64L14 5.382l-3 2.923.708 4.131L8 10.348l-3.708 2.088L5 8.305 2 5.382l4.204-.742L8 1z" />
        </svg>
      ))}
    </span>
  );
}

export default function CourseCard({ course }: { course: Course }) {
  const [wished, setWished] = useState(false);
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(course.id);
  const discount = Math.round((1 - course.price / course.originalPrice) * 100);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-250 flex flex-col">
      <Link to={`/courses/${course.id}`} className="relative overflow-hidden block bg-gray-100 aspect-video">
        <img
          src={`https://images.unsplash.com/${course.image}?w=480&h=270&fit=crop&auto=format`}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
        />
        {course.badge && (
          <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm ${
            course.badge === "Bestseller" ? "bg-[#F5A623] text-[#1B1F3B]"
            : course.badge === "Hot" ? "bg-red-500 text-white"
            : "bg-[#1B1F3B] text-white"
          }`}>
            {course.badge}
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); setWished((w) => !w); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20"
            fill={wished ? "#EF4444" : "none"}
            stroke={wished ? "#EF4444" : "#374151"}
            strokeWidth="1.5">
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
          </svg>
        </button>
      </Link>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <Link to={`/courses/${course.id}`}>
          <h3 className="font-display font-semibold text-sm leading-snug line-clamp-2 text-gray-900 hover:text-[#1B1F3B] transition-colors">
            {course.title}
          </h3>
        </Link>
        <p className="text-xs text-gray-500">{course.instructor}</p>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-[#c47a00]">{course.rating}</span>
          <StarRating rating={course.rating} />
          <span className="text-xs text-gray-400">({course.reviews.toLocaleString()})</span>
        </div>

        <div className="text-xs text-gray-400">
          {course.hours}h · {course.lectures} lectures · {course.level}
        </div>

        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100">
          <span className="font-bold text-gray-900">${course.price}</span>
          <span className="text-xs text-gray-400 line-through">${course.originalPrice}</span>
          <span className="text-xs font-bold text-green-600 ml-auto">{discount}% off</span>
        </div>

        <button
          onClick={() => addToCart(course)}
          disabled={inCart}
          className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${
            inCart
              ? "bg-green-50 text-green-700 border border-green-200 cursor-default"
              : "bg-[#1B1F3B] text-white hover:bg-[#252a4a] active:scale-95"
          }`}
        >
          {inCart ? "✓ Added to cart" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
