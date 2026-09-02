import { ESSENTIAL_SKILLS } from "@/data/courses";
import { useState } from "react";
import { Link } from "react-router";

export function EssentialSkillsCarousel() {
  const [page, setPage] = useState(0);
  const pages = [ESSENTIAL_SKILLS.slice(0, 3), ESSENTIAL_SKILLS.slice(3)];

  return (
    <section className="overflow-hidden bg-white py-16 sm:py-20">
      <div className="mx-auto grid w-full max-w-375 px-4 sm:px-6 gap-10 lg:grid-cols-[minmax(220px,0.72fr)_minmax(0,2.28fr)] lg:items-center lg:gap-12">
        <div className="max-w-xl lg:pt-2">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#015196]">
            Build your edge
          </p>
          <h2 className="font-display text-3xl font-bold leading-tight text-[#003B6D] sm:text-4xl md:text-5xl">
            Learn essential career and life skills
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[#7c819e] sm:text-lg">
            ExpertEdge helps you build in-demand skills fast and advance your
            career in a changing job market.
          </p>
        </div>

        <div className="min-w-0">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${page * 100}%)` }}
            >
              {pages.map((skills, pageIndex) => (
                <div
                  key={pageIndex}
                  className="grid min-w-full grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5"
                >
                  {skills.map((skill) => (
                    <Link
                      key={skill.title}
                      to="#courses"
                      className="group relative aspect-[0.91] min-w-0 overflow-hidden rounded-[22px] p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1 sm:aspect-[0.72] sm:p-5"
                      style={{ backgroundColor: skill.tint }}
                    >
                      <img
                        src={`https://images.unsplash.com/${skill.image}?w=900&h=900&fit=crop&auto=format&q=80`}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/5" />
                      <div className="absolute inset-x-4 bottom-4 flex min-h-28 items-center justify-between rounded-xl bg-white px-5 py-5 shadow-lg sm:inset-x-5 sm:bottom-5">
                        <span className="text-xl font-medium text-[#292b45] sm:text-2xl">
                          {skill.title}
                        </span>
                        <span className="ml-3 text-3xl font-light text-[#015196] transition-transform group-hover:translate-x-1">
                          <span aria-hidden="true">→</span>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-5">
            <button
              type="button"
              aria-label="Previous essential skills"
              onClick={() =>
                setPage(
                  (current) => (current - 1 + pages.length) % pages.length,
                )
              }
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl text-[#292b45] shadow-[0_6px_24px_rgba(41,43,69,0.12)] transition hover:-translate-x-0.5 hover:shadow-lg"
            >
              <span aria-hidden="true">←</span>
            </button>
            <div
              className="flex items-center gap-2"
              aria-label="Carousel pages"
            >
              {pages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to skills page ${index + 1}`}
                  aria-current={page === index}
                  onClick={() => setPage(index)}
                  className={`h-4 rounded-full transition-all ${page === index ? "w-14 bg-[#015196]" : "w-4 bg-[#e8e8f1] hover:bg-[#c7c7d8]"}`}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next essential skills"
              onClick={() => setPage((current) => (current + 1) % pages.length)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl text-[#292b45] shadow-[0_6px_24px_rgba(41,43,69,0.12)] transition hover:translate-x-0.5 hover:shadow-lg"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
