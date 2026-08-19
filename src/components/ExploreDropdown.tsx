import { useState } from "react";
import { Link } from "react-router";
import { CATEGORIES, COURSES } from "../data/courses";

const FEATURED_CATEGORIES = [
  "Development",
  "Design",
  "Data Science",
  "Business",
  "Marketing",
];

export default function ExploreDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <Link
        to="/"
        className="text-sm font-medium px-3 py-2 rounded-lg text-neutral-700 hover:text-primary-blue hover:bg-neutral-100 transition-colors"
        aria-haspopup="true"
        aria-expanded={open}
      >
        Explore
      </Link>

      <div
        className={`fixed left-0 right-0 top-16 z-50 transition-all duration-200 ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <div className="border-b border-neutral-200 bg-white px-6 py-6 shadow-xl shadow-neutral-900/10 sm:px-10 lg:px-12">
          <div className="mx-auto max-w-8xl">
            <div className="mb-5 flex items-end justify-between gap-4 border-b border-neutral-100 pb-4">
              <div>
                {/* <p className="text-xs font-bold uppercase tracking-widest text-primary-blue">
                  Learn something new
                </p> */}
                <h2 className="mt-1 font-display text-xl font-bold text-charcoal">
                  Explore top courses
                </h2>
              </div>
              <Link
                to="/#courses"
                className="shrink-0 text-xs font-semibold text-primary-blue transition-colors hover:text-deep-blue"
                onClick={() => setOpen(false)}
              >
                View all courses <span aria-hidden="true">-&gt;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-5">
              {FEATURED_CATEGORIES.map((categoryName) => {
                const category = CATEGORIES.find(({ name }) => name === categoryName);
                const categoryCourses = COURSES.filter(
                  ({ category: courseCategory }) => courseCategory === categoryName,
                ).slice(0, 2);

                return (
                  <div key={categoryName} className="min-w-0">
                    <Link
                      to={`/?category=${encodeURIComponent(categoryName)}#courses`}
                      className="mb-2 block border-b border-neutral-100 pb-2 text-sm font-semibold text-charcoal transition-colors hover:text-primary-blue"
                      onClick={() => setOpen(false)}
                    >
                      {categoryName === "Data Science" ? "Data & AI" : categoryName}
                      <span className="ml-1 text-[11px] font-normal text-neutral-500">
                        ({category?.count.toLocaleString()})
                      </span>
                    </Link>

                    <div className="space-y-1">
                      {categoryCourses.map((course) => (
                        <Link
                          key={course.id}
                          to={`/course/${course.id}`}
                          className="block rounded-md py-1.5 text-xs leading-snug text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-primary-blue"
                          onClick={() => setOpen(false)}
                        >
                          {course.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
