import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import type { Course } from "../data/courses";

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className="w-3 h-3"
          viewBox="0 0 16 16"
          fill={
            s <= Math.floor(rating)
              ? "#F5A623"
              : s - 0.5 <= rating
                ? "url(#half-c)"
                : "#E5E7EB"
          }
        >
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

export default function CourseCard({
  course,
  popoverSide = "right",
}: {
  course: Course;
  popoverSide?: "left" | "right";
}) {
  const [wished, setWished] = useState(false);
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();
  const inCart = isInCart(course.id);
  const discount = Math.round((1 - course.price / course.originalPrice) * 100);
  const hoverFlipClass =
    popoverSide === "left"
      ? "group-hover:[transform:rotateY(-180deg)] group-focus-within:[transform:rotateY(-180deg)]"
      : "group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)]";
  const backFaceTransform =
    popoverSide === "left"
      ? "[transform:rotateY(-180deg)]"
      : "[transform:rotateY(180deg)]";
  const openCourse = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("a, button")) return;
    navigate(`/courses/${course.id}`);
  };

  return (
    <div
      className="group relative h-full min-h-[25rem] cursor-pointer [perspective:1200px]"
      onClick={openCourse}
    >
      <button
        type="button"
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => setWished((w) => !w)}
        className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-md ring-1 ring-slate-100 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#154c8c]"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill={wished ? "#EF4444" : "none"}
          stroke={wished ? "#EF4444" : "#374151"}
          strokeWidth="1.5"
        >
          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
      </button>
      <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)]">
        <div className="absolute inset-0 flex h-full flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_18px_42px_rgba(15,23,42,0.08)] [backface-visibility:hidden]">
          <Link
            to={`/courses/${course.id}`}
            className="relative block aspect-video shrink-0 overflow-hidden bg-slate-100"
          >
            <img
              src={`https://images.unsplash.com/${course.image}?w=480&h=270&fit=crop&auto=format`}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0b1735]/65 via-[#0b1735]/10 to-transparent" />
            {course.badge && (
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#0b1735] shadow-sm">
                {course.badge}
              </span>
            )}
          </Link>

          <div className="flex flex-1 flex-col gap-2 p-4">
            <Link to={`/courses/${course.id}`}>
              <h3 className="line-clamp-2 font-display text-[1.05rem] font-black leading-snug text-slate-900 transition-colors hover:text-[#154c8c]">
                {course.title}
              </h3>
            </Link>
            <p className="text-xs text-slate-500">{course.instructor}</p>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-[#d88a00]">
                {course.rating}
              </span>
              <StarRating rating={course.rating} />
              <span className="text-xs text-slate-400">
                ({course.reviews.toLocaleString()})
              </span>
            </div>
            <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-3">
              <span className="text-lg font-black text-slate-900">
                ${course.price}
              </span>
              <span className="text-xs text-slate-400 line-through">
                ${course.originalPrice}
              </span>
              <span className="ml-auto rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
                {discount}% off
              </span>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 flex h-full flex-col overflow-hidden rounded-[22px] border border-[#dbe7f5] bg-[linear-gradient(180deg,#f8fbff_0%,#edf4fb_100%)] p-5 text-[#1B1F3B] shadow-[0_24px_60px_rgba(11,23,53,0.12)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="mb-3 flex items-start justify-between gap-3 pr-10">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#154c8c]">
              Inside the course
            </span>
            <span className="text-xs font-semibold text-[#117a5c]">
              {course.lastUpdated}
            </span>
          </div>
          <h3 className="line-clamp-3 font-display text-xl font-black leading-tight text-slate-900">
            {course.title}
          </h3>
          <p className="mt-2 text-xs text-slate-500">
            {course.hours} hours · {course.level} · {course.lectures} lessons
          </p>
          <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-slate-600">
            {course.description}
          </p>
          <div className="mt-4 space-y-2 text-xs leading-relaxed text-slate-600">
            {course.whatYoullLearn.slice(0, 3).map((item) => (
              <div key={item} className="flex gap-2">
                <span
                  className="shrink-0 font-black text-[#154c8c]"
                  aria-hidden="true"
                >
                  +
                </span>
                <span className="line-clamp-2">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto flex items-center gap-3 border-t border-slate-200 pt-4">
            <span className="font-display text-2xl font-black text-[#0b1735]">
              ${course.price}
            </span>
            <button
              onClick={() => addToCart(course)}
              disabled={inCart}
              className={`ml-auto rounded-xl px-4 py-2.5 text-xs font-bold transition-colors ${inCart ? "cursor-default bg-emerald-100 text-emerald-700" : "bg-[#154c8c] text-white hover:bg-[#0b1735]"}`}
            >
              {inCart ? "Added" : "Add to cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
