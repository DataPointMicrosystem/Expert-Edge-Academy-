import { HERO_SLIDES } from "@/data/courses";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const go = useCallback(
    (idx: number) => {
      if (animating) return;
      setAnimating(true);
      setTimeout(() => {
        setCurrent(idx);
        setAnimating(false);
      }, 300);
    },
    [animating],
  );

  useEffect(() => {
    const t = setInterval(() => go((current + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, [current, go]);

  const slide = HERO_SLIDES[current];

  return (
    <section
      className={`relative mx-auto mt-3 w-[calc(100%-2rem)] max-w-375 overflow-hidden rounded-[28px] bg-linear-to-br ${slide.bg} text-white shadow-[0_28px_80px_rgba(11,23,53,0.18)] ring-1 ring-white/10 transition-all duration-700 sm:mt-4 min-h-0 md:min-h-150`}
    >
      <div className="absolute inset-0">
        <img
          src={`https://images.unsplash.com/${slide.img}?w=1400&h=640&fit=crop&auto=format&q=60`}
          alt=""
          className={`h-full w-full object-cover transition-opacity duration-700 ${animating ? "opacity-0" : "opacity-35"}`}
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#071b32]/90 via-[#0b1735]/80 to-[#0b1735]/45" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(247,185,85,0.28),transparent_22%)]" />
      </div>

      <div className="relative mx-auto grid max-w-375 items-center gap-8 px-5 py-12 sm:px-10 sm:py-16 md:grid-cols-2 md:px-12 md:py-20 lg:px-14 lg:py-24">
        <div
          className={`transition-all duration-500 ${animating ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"}`}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: slide.accent }}
            />
            {slide.badge}
          </div>

          <h1 className="mb-4 whitespace-pre-line text-3xl font-black leading-[1.04] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl">
            {slide.headline.split("\n").map((line, i) => (
              <span key={i}>
                {i === 1 ? (
                  <em className="not-italic" style={{ color: "#F7B955" }}>
                    {line}
                  </em>
                ) : (
                  line
                )}
                {i === 0 && <br />}
              </span>
            ))}
          </h1>

          <p className="mb-6 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base md:text-lg">
            {slide.sub}
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href={slide.ctaHref}
              className="rounded-full px-5 py-3 text-sm font-bold shadow-[0_20px_40px_rgba(11,23,53,0.28)] transition-all hover:-translate-y-0.5 active:translate-y-0 sm:px-7 sm:py-3.5"
              style={{ backgroundColor: slide.accent, color: "#fff" }}
            >
              {slide.cta}
            </a>
            <Link
              to="/signup"
              className="rounded-full border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm hover:bg-white/10 sm:px-7 sm:py-3.5"
            >
              Start for free →
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/15 pt-6">
            {[
              { v: "40k+", l: "Learners" },
              { v: "1:1", l: "Mentor support" },
              { v: "Career-led", l: "Curriculum" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-lg font-black text-white">
                  {s.v}
                </div>
                <div className="text-[12px] font-medium text-white/70">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`hidden lg:flex min-w-0 flex-col items-end transition-all duration-500 ${animating ? "translate-x-4 opacity-0" : "translate-x-0 opacity-100"}`}
        >
          <div className="relative w-full max-w-[31rem] [perspective:1400px]">
            <div
              className="absolute -inset-3 rounded-[28px] opacity-60 blur-2xl"
              style={{ backgroundColor: slide.accent }}
            />
            <div className="absolute inset-x-6 -bottom-4 top-5 rounded-[26px] border border-white/20 bg-white/10 transform-[translateZ(-28px)_rotateY(-6deg)]" />
            <div className="relative overflow-hidden rounded-[26px] bg-white text-slate-900 shadow-[0_30px_80px_rgba(11,23,53,0.25)] ring-1 ring-white/60 transform-[rotateY(-3deg)_rotateX(2deg)]">
              <img
                src={`https://images.unsplash.com/${slide.img}?w=480&h=240&fit=crop&auto=format`}
                alt="Featured course"
                className="aspect-[5/3] w-full object-cover"
              />
              <div className="p-4">
                <span
                  className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em]"
                  style={{
                    backgroundColor: `${slide.accent}22`,
                    color: "#0b1735",
                  }}
                >
                  {HERO_SLIDES[current].tag}
                </span>
                <p className="mt-3 font-display text-2xl font-black leading-snug text-slate-900">
                  {slide.headline.replace("\n", " ")}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
                  <div className="flex gap-0.5 text-[#154c8c]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s}>★</span>
                    ))}
                  </div>
                  <span className="text-lg font-black text-[#0b1735]">
                    From ₦15,000
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-600">
                ✓
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-900">
                  Certificate included
                </div>
                <div className="text-[10px] text-slate-500">
                  Shareable on LinkedIn
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`transition-all duration-300 rounded-full h-2 ${i === current ? "w-8 bg-white" : "w-2 bg-white/40"}`}
          />
        ))}
      </div>

      {/* Arrow controls */}
      <button
        onClick={() =>
          go((current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
        }
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/15 backdrop-blur hover:bg-white/25 transition-colors flex items-center justify-center sm:left-4 sm:w-10 sm:h-10"
      >
        <svg
          className="w-5 h-5 text-white"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <button
        onClick={() => go((current + 1) % HERO_SLIDES.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/15 backdrop-blur hover:bg-white/25 transition-colors flex items-center justify-center sm:right-4 sm:w-10 sm:h-10"
      >
        <svg
          className="w-5 h-5 text-white"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </section>
  );
}
