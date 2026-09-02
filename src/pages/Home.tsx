import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router";
import { COURSES, CATEGORIES, COMPANIES, TESTIMONIALS } from "../data/courses";
import CourseCard from "../components/CourseCard";
import { HeroCarousel } from "@/components/HeroCarousel";
import { EssentialSkillsCarousel } from "@/components/EssentialSkillsCarousel";

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
  const trendingCourses = [...COURSES]
    .sort(
      (firstCourse, secondCourse) =>
        secondCourse.enrolled - firstCourse.enrolled,
    )
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-transparent">
      <HeroCarousel />
      {/* Trusted by */}
      <section className="border-y border-slate-200/80 bg-white/80 py-5 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-375 flex-col items-center gap-4 px-4 sm:flex-row sm:px-6">
          <p className="whitespace-nowrap text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 sm:justify-start">
            {COMPANIES.map((c) => (
              <span
                key={c}
                className="cursor-default text-sm font-bold text-slate-300 transition-colors hover:text-slate-500"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto w-full max-w-375 px-4 py-14 sm:px-6 lg:py-16">
        <div className="mb-8 flex items-end justify-between sm:mb-9">
          <div>
            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-[#154c8c]">
              Career acceleration
            </p>
            <h2 className="mb-2 text-3xl font-black text-[#0b1735] sm:text-4xl">
              Skills that create momentum.
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-slate-600">
              From essential professional skills to in-demand technical
              knowledge, ExpertEdge Academy helps you prepare for what’s next.
            </p>
          </div>
          <button
            onClick={() => setSelectedCat("All")}
            className="hidden text-sm font-semibold text-[#154c8c] hover:underline sm:block"
          >
            View all →
          </button>
        </div>
        <nav
          aria-label="Popular topics"
          className="mt-12 overflow-hidden border-b border-[#cfd4dc]"
        >
          <div className="flex flex-wrap items-end gap-0">
            <button
              onClick={() => {
                setSelectedCat("All");
                document
                  .getElementById("courses")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`whitespace-nowrap border-b-2 px-4 pb-3 pt-1 text-sm transition-colors first:pl-1 sm:px-5 ${
                selectedCat === "All"
                  ? "border-[#1b1f3b] font-semibold text-[#071b3a]"
                  : "border-transparent font-normal text-[#71809a] hover:text-[#071b3a]"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category.name}
                onClick={() => {
                  setSelectedCat(
                    category.name === selectedCat ? "All" : category.name,
                  );
                  document
                    .getElementById("courses")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`whitespace-nowrap border-b-2 px-4 pb-3 pt-1 text-sm transition-colors first:pl-1 sm:px-5 ${
                  selectedCat === category.name
                    ? "border-[#1b1f3b] font-semibold text-[#071b3a]"
                    : "border-transparent font-normal text-[#71809a] hover:text-[#071b3a]"
                }`}
              >
                {category.name}
                <span className="ml-1 text-xs text-[#9aa3b1]">
                  ({category.count.toLocaleString()})
                </span>
              </button>
            ))}
          </div>
        </nav>
      </section>

      {/* Promo Banner 1 — Sale */}
      <section className="mx-auto mb-10 w-full max-w-375 px-4 sm:px-6">
        <div className="relative flex min-h-55 flex-col items-center gap-6 overflow-hidden rounded-[30px] bg-[linear-gradient(135deg,#0b1735_0%,#154c8c_45%,#0f254d_100%)] px-8 py-8 text-white md:flex-row md:px-14 md:py-9">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1543269664-76bc3997d9ea?w=600&h=300&fit=crop&auto=format"
              alt=""
              className="h-full w-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(247,185,85,0.28),transparent_26%)]" />
          </div>
          <div className="relative z-10 min-w-0 flex-1">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-[#f7d28b]">
              🔥 Weekend sale
            </p>
            <h2 className="mb-2 font-display text-3xl font-black md:text-4xl">
              All courses <span className="text-[#f7b955]">$9.99</span>
            </h2>
            <p className="max-w-sm text-sm text-white/75">
              Sale ends Sunday. Over 68,000 courses to choose from.
            </p>
          </div>
          <div className="relative z-10 flex w-full flex-col items-center gap-3 md:w-auto">
            <div className="flex gap-2 sm:gap-3">
              {["08", "14", "32"].map((v, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 font-display text-2xl font-black shadow-inner ring-1 ring-white/10 sm:h-16 sm:w-16 sm:text-3xl">
                    {v}
                  </div>
                  <span className="mt-1 text-[10px] uppercase tracking-[0.1em] text-white/50">
                    {["hrs", "min", "sec"][i]}
                  </span>
                </div>
              ))}
            </div>
            <a
              href="#courses"
              className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-[#0b1735] transition-colors hover:bg-[#f4f6fb]"
            >
              Claim your deal →
            </a>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section
        id="courses"
        className="mx-auto w-full max-w-375 px-4 sm:px-6 pb-16"
      >
        <div className="flex items-end justify-between mb-8">
          <div>
            {/* <p className="text-xs font-bold uppercase tracking-widest text-[#F5A623] mb-1">
              {selectedCat === "All" ? "Most popular" : selectedCat}
            </p> */}
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((c, index) => (
              <CourseCard
                key={c.id}
                course={c}
                popoverSide={index % 4 === 3 ? "left" : "right"}
              />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <button className="rounded-full border-2 border-[#154c8c] px-8 py-3.5 text-sm font-bold text-[#154c8c] transition-all hover:bg-[#0b1735] hover:text-white">
            View all 68,000+ courses
          </button>
        </div>
      </section>

      {/* Promo Banner 2 — Teach */}
      <section className="mx-auto mb-14 w-full max-w-375 px-4 sm:px-6">
        <div className="relative grid min-h-56 items-center gap-8 overflow-hidden rounded-[30px] bg-[linear-gradient(135deg,#0b1735_0%,#154c8c_38%,#1d3d65_100%)] px-8 py-10 text-white md:grid-cols-2 md:px-14 md:pt-12">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1600&h=450&fit=crop&auto=format&q=80"
              alt=""
              className="h-full w-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,185,85,0.24),transparent_24%)]" />
          </div>
          <div>
            <p className="relative z-10 mb-3 text-xs font-black uppercase tracking-[0.22em] text-[#f7d28b]">
              💡 Become an instructor
            </p>
            <h2 className="relative z-10 mb-4 font-display text-3xl font-black leading-tight md:text-4xl">
              Teach what you know.
              <br />
              Earn what you deserve.
            </h2>
            <p className="relative z-10 mb-6 max-w-sm text-sm leading-relaxed text-white/80">
              Join 14,000+ instructors earning passive income. Keep 70% of every
              sale. No experience required.
            </p>
            <Link
              to="/signup"
              className="relative z-10 inline-flex items-center gap-2 rounded-full bg-[#f7b955] px-6 py-3 text-sm font-bold text-[#0b1735] shadow-[0_20px_35px_rgba(247,185,85,0.28)] transition-all hover:-translate-y-0.5"
            >
              Start teaching today →
            </Link>
          </div>
          <div className="relative z-10 hidden items-end justify-end md:flex">
            <div className="relative w-56">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&auto=format&q=80"
                alt="Team collaboration"
                className="w-full h-64 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-4 bg-white rounded-2xl px-5 py-4 shadow-2xl border border-white/20 w-48">
                <div className="text-[10px] text-gray-400">
                  Top instructor this month
                </div>
                <div className="font-display font-bold text-2xl text-[#003B6D]">
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

      {/* Trending courses */}
      <section className="mx-auto w-full max-w-375 px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-[11px] font-black uppercase tracking-[0.22em] text-[#154c8c]">
              Most Popular
            </p>
            <h2 className="font-display text-3xl font-black text-[#0b1735] md:text-4xl">
              Trending courses
            </h2>
          </div>
          <a
            href="#courses"
            className="hidden text-sm font-semibold text-[#154c8c] transition-colors hover:text-[#0b1735] sm:block"
          >
            View all courses →
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trendingCourses.map((course, index) => (
            <CourseCard
              key={course.id}
              course={course}
              popoverSide={index % 4 === 3 ? "left" : "right"}
            />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative min-h-72 overflow-hidden py-16 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&h=600&fit=crop&auto=format&q=80"
            alt="Learning background"
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#0b1735_0%,#0b1735_55%,#154c8c_100%)]" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-375 px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-[#f7d28b]">
              Get started
            </p>
            <h2 className="font-display text-3xl font-black md:text-4xl">
              Learning made ridiculously simple
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
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
                className="relative rounded-2xl border border-white/15 bg-white/8 p-7 backdrop-blur-sm transition-colors hover:bg-white/12"
              >
                <span className="absolute right-6 top-5 select-none font-display text-5xl font-black text-white/10">
                  {s.step}
                </span>
                <div className="mb-4 text-3xl">{s.icon}</div>
                <h3 className="mb-2 font-display text-xl font-semibold">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/65">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EssentialSkillsCarousel />

      {/* Testimonials */}
      <section className="py-16 bg-[#F9F8F5]">
        <div className="mx-auto w-full max-w-375 px-4 sm:px-6">
          <div className="text-center mb-10">
            {/* <p className="text-xs font-bold uppercase tracking-widest text-[#F5A623] mb-2">
              Student stories
            </p> */}
            <h2 className="font-display font-bold text-3xl md:text-4xl text-[#1B1F3B]">
              Join a community of learners building a better future
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
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0b1735_0%,#154c8c_48%,#0f254d_100%)] py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1800&q=80"
            alt=""
            className="h-full w-full object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(247,185,85,0.24),transparent_24%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center text-white sm:px-6">
          <div className="mb-5 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-3xl shadow-lg ring-1 ring-white/15 backdrop-blur-sm">
              🎓
            </div>
          </div>

          <h2 className="font-display text-4xl font-black leading-none text-white sm:text-5xl lg:text-[5rem]">
            Your next skill is waiting.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base text-white/85 sm:text-lg">
            Join 2.4 million learners already growing their careers on
            ExpertEdge. First course from $9.99.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-full bg-[#f7b955] px-8 py-4 text-base font-bold text-[#0b1735] shadow-[0_20px_40px_rgba(247,185,85,0.3)] transition-colors hover:bg-[#f6c779]"
            >
              Get started for free
            </Link>
            <a
              href="#courses"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-bold text-white shadow-lg transition-colors hover:bg-white/10"
            >
              Browse courses
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
