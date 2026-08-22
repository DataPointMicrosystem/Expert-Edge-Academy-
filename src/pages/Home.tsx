import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router";
import { COURSES, CATEGORIES } from "../data/courses";
import CourseCard from "../components/CourseCard";

const HERO_SLIDES = [
  {
    id: 1,
    tag: "Learn. Grow. Get ahead.",
    headline: "Skills that move\nyou forward.",
    sub: "Learn practical skills from experienced instructors and build the knowledge you need for your career, business, and future.",
    cta: "Explore courses",
    ctaHref: "#courses",
    accent: "#00549C",
    bg: "from-[#001B33] to-[#003B6D]",
    img: "photo-1522202176988-66273c2fd55f",
    badge: "Learn from expert instructors",
  },
  {
    id: 2,
    tag: "Explore new skills",
    headline: "Learn today.\nBuild tomorrow.",
    sub: "Discover courses in technology, business, design, finance, marketing, and more — all in one learning platform.",
    cta: "Browse courses",
    ctaHref: "#courses",
    accent: "#00549C",
    bg: "from-[#001B33] to-[#333333]",
    img: "photo-1677442135703-1787eea5ce01",
    badge: "Courses across multiple categories",
  },
  {
    id: 3,
    tag: "Learn from experts",
    headline: "Turn knowledge\ninto real skills.",
    sub: "Learn through practical lessons, hands-on projects, and expert-led courses designed to help you apply what you learn.",
    cta: "Start learning",
    ctaHref: "#courses",
    accent: "#00549C",
    bg: "from-[#001B33] to-[#003B6D]",
    img: "photo-1561070791-2526d30994b5",
    badge: "Practical learning that works",
  },
];
const TESTIMONIALS = [
  {
    name: "Marcus Reid",
    role: "Software Engineer · Stripe",
    text: "ExpertEdge helped me land my first engineering job in six months. The React course alone paid for itself 100 times over.",
    avatar: "photo-1507003211169-0a1dd7228f2d",
  },
  {
    name: "Priya Nair",
    role: "Freelance UI Designer",
    text: "I went from zero design skills to booking $5k/month clients within six months. The UI/UX bootcamp is genuinely world-class.",
    avatar: "photo-1494790108377-be9c29b29330",
  },
  {
    name: "David Okafor",
    role: "Data Analyst · Netflix",
    text: "The Python for Data Science course is hands-down the most comprehensive I've found anywhere. The instructor is exceptional.",
    avatar: "photo-1500648767791-00dcc994a43e",
  },
];

const COMPANIES = [
  "Google",
  "Microsoft",
  "Spotify",
  "Amazon",
  "Shopify",
  "Airbnb",
  "Netflix",
  "Stripe",
];

const TOPIC_TABS = [
  "Artificial Intelligence (AI)",
  "Python",
  "Microsoft Excel",
  "AI Agents & Agentic AI",
  "Digital Marketing",
  "Amazon AWS",
];

function HeroCarousel() {
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
      className={`relative mx-auto mt-3 w-[calc(100%-1rem)] overflow-hidden rounded-2xl bg-linear-to-br ${slide.bg} text-white shadow-2xl ring-1 ring-black/10 transition-all duration-700 sm:mt-4 sm:w-[calc(100%-3rem)] sm:rounded-[28px] lg:w-[100%-3rem] min-h-0 md:min-h-150`}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={`https://images.unsplash.com/${slide.img}?w=1400&h=640&fit=crop&auto=format&q=60`}
          alt=""
          className={`w-full h-full object-cover transition-opacity duration-700 ${animating ? "opacity-0" : "opacity-30"}`}
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#001B33]/90 via-[#003B6D]/65 to-[#003B6D]/30" />
      </div>

      <div className="relative max-w-375 mx-auto px-5 py-12 sm:px-10 sm:py-16 md:px-12 md:py-24 lg:px-14 lg:py-28 grid md:grid-cols-2 gap-10 items-center">
        <div
          className={`transition-all duration-500 ${animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
        >
          {/* <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-1.5 text-xs font-semibold mb-5 border border-white/20">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: slide.accent }}
            />
            {slide.badge}
          </div> */}
          <h1 className="font-display font-black text-3xl leading-[1.08] tracking-tight mb-4 sm:text-5xl sm:mb-5 md:text-6xl whitespace-pre-line drop-shadow-sm">
            {slide.headline.split("\n").map((line, i) => (
              <span key={i}>
                {i === 1 ? (
                  <em className="not-italic" style={{ color: "#ffff" }}>
                    {line}
                  </em>
                ) : (
                  line
                )}
                {i === 0 && <br />}
              </span>
            ))}
          </h1>
          <p className="text-white/85 text-sm leading-relaxed mb-6 sm:text-base md:text-lg md:mb-8 font-medium max-w-lg">
            {slide.sub}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={slide.ctaHref}
              className="px-5 py-3 rounded-full font-bold text-sm shadow-lg transition-all hover:scale-105 active:scale-100 sm:px-7 sm:py-3.5"
              style={{ backgroundColor: slide.accent, color: "#FFFFFF" }}
            >
              {slide.cta}
            </a>
            <Link
              to="/signup"
              className="px-5 py-3 rounded-full font-bold text-sm border-2 border-white/30 hover:bg-white/10 transition-colors sm:px-7 sm:py-3.5"
            >
              Start for free →
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-6 pt-5 border-t border-white/15 sm:gap-6 sm:mt-8 sm:pt-6">
            {[
              { v: "Expert", l: "Instructors" },
              { v: "Practical", l: "Learning" },
              { v: "Flexible", l: "Learning Pace" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display font-black text-[1rem]">{s.v}</div>
                <div className="text-[14px] font-medium text-white/65">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured card */}
        <div
          className={`hidden lg:flex min-w-0 flex-col items-end transition-all duration-500 ${animating ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}`}
        >
          <div className="relative w-full max-w-150 [perspective:1400px] lg:scale-105">
            <div
              className="absolute -inset-2 rounded-2xl opacity-50 blur-xl"
              style={{ backgroundColor: slide.accent }}
            />
            <div className="absolute inset-x-5 -bottom-3 top-3 rounded-2xl border border-white/20 bg-white/10 transform-[translateZ(-28px)_rotateY(-4deg)]" />
            <div className="relative overflow-hidden rounded-2xl bg-white text-gray-900 shadow-2xl ring-1 ring-white/50 transform-[rotateY(-3deg)_rotateX(1deg)] transition-transform duration-500 hover:transform-[rotateY(0deg)_rotateX(0deg)]">
              <img
                src={`https://images.unsplash.com/${slide.img}?w=480&h=240&fit=crop&auto=format`}
                alt="Featured"
                className="w-full aspect-2/1 object-cover contrast-110"
              />
              <div className="p-4">
                <span
                  className="text-xs font-black px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: slide.accent, color: "#FFFFFF" }}
                >
                  {HERO_SLIDES[current].tag}
                </span>
                <p className="font-display font-black text-base mt-2 leading-snug">
                  {slide.headline.replace("\n", " ")}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-primary-blue text-xs">
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="font-black text-deep-blue">From $9.99</span>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-6 bg-white rounded-xl px-4 py-3 shadow-2xl border border-gray-100 flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-black text-sm">
                ✓
              </div>
              <div>
                <div className="text-xs font-black text-gray-900">
                  Certificate included
                </div>
                <div className="text-[10px] text-gray-400">
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

export default function Home() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const categoryParam = searchParams.get("category");
  const [selectedCat, setSelectedCat] = useState(categoryParam ?? "All");

  useEffect(() => {
    setSelectedCat(categoryParam ?? "All");
  }, [categoryParam]);

  const filtered = COURSES.filter((c) => {
    const matchQ =
      !query ||
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.instructor.toLowerCase().includes(query.toLowerCase());
    const matchCat = selectedCat === "All" || c.category === selectedCat;
    return matchQ && matchCat;
  });

  return (
    <div className="min-h-screen bg-[#F9F8F5]">
      <HeroCarousel />

      {/* Trusted by */}
      <section className="bg-white border-y border-gray-100 py-5 px-4 sm:px-6">
        <div className="max-w-250 mx-auto flex flex-col sm:flex-row items-center gap-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 justify-center sm:justify-start">
            {COMPANIES.map((c) => (
              <span
                key={c}
                className="text-sm font-bold text-gray-300 hover:text-gray-500 transition-colors cursor-default"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-375 mx-auto px-4 py-14 sm:px-6 lg:py-16">
        <div className="mb-8 flex items-end justify-between sm:mb-9">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#F5A623]">
              Browse by topic
            </p>
            <h2 className="font-display text-3xl font-bold leading-none text-[#1B1F3B] sm:text-[32px]">
              Top categories
            </h2>
          </div>
          <button
            onClick={() => setSelectedCat("All")}
            className="text-sm font-semibold text-[#1B1F3B] hover:underline hidden sm:block"
          >
            View all →
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-8 md:gap-3.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setSelectedCat(cat.name === selectedCat ? "All" : cat.name);
                setTimeout(
                  () =>
                    document
                      .getElementById("courses")
                      ?.scrollIntoView({ behavior: "smooth" }),
                  50,
                );
              }}
              className={`flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border bg-white px-2 py-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-md ${
                selectedCat === cat.name
                  ? "border-[#F5A623] bg-[#fffaf0] shadow-md"
                  : "border-[#e9edf2] hover:border-[#d9dee6]"
              }`}
            >
              <span className="text-[25px] leading-none" aria-hidden="true">
                {cat.icon}
              </span>
              <span className="text-[11px] font-semibold leading-tight text-[#071b3a]">
                {cat.name}
              </span>
              <span className="text-[10px] font-medium text-[#9aa3b1]">
                {cat.count.toLocaleString()}
              </span>
            </button>
          ))}
        </div>

        <nav
          aria-label="Popular topics"
          className="mt-12 overflow-x-auto border-b border-[#cfd4dc]"
        >
          <div className="flex min-w-max items-end gap-0">
            {TOPIC_TABS.map((topic, index) => (
              <button
                key={topic}
                className={`whitespace-nowrap border-b-2 px-4 pb-3 pt-1 text-sm transition-colors first:pl-1 sm:px-5 ${
                  index === 0
                    ? "border-[#1b1f3b] font-semibold text-[#071b3a]"
                    : "border-transparent font-normal text-[#71809a] hover:text-[#071b3a]"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </nav>
      </section>

      {/* Promo Banner 1 — Sale */}
      <section className="mx-4 sm:mx-6 lg:mx-auto max-w-375 mb-10">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#1B1F3B] to-[#2d3360] text-white px-8 py-10 md:px-14 flex flex-col md:flex-row items-center gap-6">
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1543269664-76bc3997d9ea?w=600&h=300&fit=crop&auto=format"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 flex-1">
            <p className="text-[#F5A623] text-xs font-bold uppercase tracking-widest mb-2">
              🔥 Weekend sale
            </p>
            <h2 className="font-display font-black text-3xl md:text-4xl mb-2">
              All courses <span className="text-[#F5A623]">$9.99</span>
            </h2>
            <p className="text-white/60 text-sm max-w-sm">
              Sale ends Sunday. Over 68,000 courses to choose from.
            </p>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="flex gap-2">
              {["08", "14", "32"].map((v, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center font-display font-black text-2xl">
                    {v}
                  </div>
                  <span className="text-[10px] text-white/40 mt-1">
                    {["hrs", "min", "sec"][i]}
                  </span>
                </div>
              ))}
            </div>
            <a
              href="#courses"
              className="px-6 py-2.5 rounded-full bg-[#F5A623] text-[#1B1F3B] font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Claim your deal →
            </a>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="max-w-375 mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#F5A623] mb-1">
              {selectedCat === "All" ? "Most popular" : selectedCat}
            </p>
            <h2 className="font-display font-bold text-3xl text-[#1B1F3B]">
              {query
                ? `Results for "${query}"`
                : selectedCat === "All"
                  ? "Featured courses"
                  : `${selectedCat} courses`}
            </h2>
          </div>
          {selectedCat !== "All" && (
            <button
              onClick={() => setSelectedCat("All")}
              className="text-sm text-gray-400 hover:text-gray-700"
            >
              ← All categories
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg font-semibold text-gray-600">
              No courses found
            </p>
            <button
              onClick={() => setSelectedCat("All")}
              className="mt-3 text-sm text-[#1B1F3B] underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <button className="px-8 py-3.5 rounded-full border-2 border-[#1B1F3B] text-[#1B1F3B] font-bold text-sm hover:bg-[#1B1F3B] hover:text-white transition-all">
            View all 68,000+ courses
          </button>
        </div>
      </section>

      {/* Promo Banner 2 — Teach */}
      <section className="mx-4 sm:mx-6 lg:mx-auto max-w-375 mb-14">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#F5A623] to-[#f7bb56] text-[#1B1F3B] px-8 py-10 md:px-14 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-[#1B1F3B]/60 text-xs font-bold uppercase tracking-widest mb-2">
              💡 Become an instructor
            </p>
            <h2 className="font-display font-black text-3xl md:text-4xl mb-3">
              Teach what you know.
              <br />
              Earn what you deserve.
            </h2>
            <p className="text-[#1B1F3B]/70 text-sm mb-6 max-w-sm">
              Join 14,000+ instructors earning passive income. Keep 70% of every
              sale. No experience required.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1B1F3B] text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg"
            >
              Start teaching today →
            </Link>
          </div>
          <div className="hidden md:flex justify-end">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=280&fit=crop&auto=format"
                alt="Instructor"
                className="rounded-2xl w-72 object-cover shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl px-4 py-3 shadow-xl border border-gray-100">
                <div className="text-[10px] text-gray-400">
                  Top instructor this month
                </div>
                <div className="font-display font-bold text-lg text-[#1B1F3B]">
                  $12,840
                </div>
                <div className="text-xs text-green-600 font-semibold">
                  ↑ 28% vs last month
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#1B1F3B] text-white py-16 px-4 sm:px-6">
        <div className="max-w-375 mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#F5A623] text-xs font-bold uppercase tracking-widest mb-2">
              Get started
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl">
              Learning made ridiculously simple
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: "🔍",
                title: "Find your course",
                desc: "Browse 68K+ expert-led courses. Filter by level, duration, language, or rating to find your perfect match.",
              },
              {
                step: "02",
                icon: "🎥",
                title: "Learn at your pace",
                desc: "Stream on any device, download for offline access, rewatch any lesson. No deadlines, no pressure.",
              },
              {
                step: "03",
                icon: "🏆",
                title: "Earn your certificate",
                desc: "Complete the course, earn a LinkedIn-shareable certificate, and open doors to your next opportunity.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="relative bg-white/5 rounded-2xl p-7 border border-white/10 hover:bg-white/8 transition-colors"
              >
                <span className="absolute top-5 right-6 font-display font-black text-5xl text-white/8 select-none">
                  {s.step}
                </span>
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-display font-semibold text-xl mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-white/55 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 bg-[#F9F8F5]">
        <div className="max-w-375 mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#F5A623] mb-2">
              Student stories
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-[#1B1F3B]">
              Real results, real people
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className="text-[#F5A623] text-sm">
                      ★
                    </span>
                  ))}
                </div>
                <blockquote className="text-sm text-gray-600 leading-relaxed flex-1">
                  "{t.text}"
                </blockquote>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <img
                    src={`https://images.unsplash.com/${t.avatar}?w=64&h=64&fit=crop&auto=format`}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover bg-gray-100"
                  />
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      {t.name}
                    </div>
                    <div className="text-xs text-gray-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-linear-to-br from-[#1B1F3B] to-[#0e1020] text-white py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-5">🎓</div>
          <h2 className="font-display font-black text-4xl md:text-5xl mb-4">
            Your next skill is <span className="text-[#F5A623]">waiting.</span>
          </h2>
          <p className="text-white/60 mb-8 text-base">
            Join 2.4 million learners already growing their careers on
            ExpertEdge. First course from $9.99.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 rounded-full bg-[#F5A623] text-[#1B1F3B] font-bold hover:opacity-90 transition-opacity shadow-lg"
            >
              Get started for free
            </Link>
            <a
              href="#courses"
              className="px-8 py-4 rounded-full border border-white/25 hover:bg-white/10 transition-colors font-semibold"
            >
              Browse courses
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
