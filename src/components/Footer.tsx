import { Link } from "react-router";

export default function Footer() {
  const getCurrentYear = () => {
    const date = new Date();
    return date.getFullYear();
  };
  const destinations: Record<string, string> = {
    "Browse courses": "/#courses",
    Categories: "/#courses",
    Pricing: "/#subscription",
    Enterprise: "mailto:info@expertedgeacademy.ng",
    "Become an instructor": "/teach",
    "Instructor handbook": "/teach",
    "Revenue share": "/revenue-share",
    Community: "/community",
    "About us": "/about",
    Careers: "/careers",
    Blog: "/blog",
    "Press kit": "/press-kit",
    "Help center": "/help-center",
    Accessibility: "/accessibility",
    "Terms of use": "/terms-of-use",
    "Privacy policy": "/privacy-policy",
  };

  return (
    <footer className="bg-[#0b1735] px-4 pb-8 pt-14 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="mb-4 flex items-center gap-2">
              <span
                className="flex size-9 items-center justify-center rounded-lg bg-white text-sm font-black text-[#154c8c]"
                aria-hidden="true"
              >
                E
              </span>
              <span className="text-sm font-bold text-white">
                ExpertEdge{" "}
                <span className="font-medium text-white/60">Academy</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-white/60">
              Online learning that opens doors and creates lasting
              opportunities.
            </p>
            <div className="mt-4 flex gap-3">
              {["𝕏", "in", "▶", "📸"].map((icon, i) => (
                <button
                  key={i}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs transition-colors hover:bg-white/20"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {[
            {
              heading: "Platform",
              links: ["Browse courses", "Categories", "Pricing", "Enterprise"],
            },
            {
              heading: "Instructors",
              links: [
                "Become an instructor",
                "Instructor handbook",
                "Revenue share",
                "Community",
              ],
            },
            {
              heading: "Company",
              links: ["About us", "Careers", "Blog", "Press kit"],
            },
            {
              heading: "Support",
              links: [
                "Help center",
                "Accessibility",
                "Terms of use",
                "Privacy policy",
              ],
            },
          ].map((col) => (
            <div key={col.heading}>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link}>
                    {destinations[link].startsWith("mailto:") ? (
                      <a
                        href={destinations[link]}
                        className="text-xs text-white/60 transition-colors hover:text-white"
                      >
                        {link}
                      </a>
                    ) : (
                      <Link
                        to={destinations[link]}
                        className="text-xs text-white/60 transition-colors hover:text-white"
                      >
                        {link}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {getCurrentYear()} ExpertEdge Academy, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1.5">
            <span className="text-xs text-white/50">🌐</span>
            <span className="text-xs text-white/60">English</span>
            <svg
              className="w-3 h-3 text-white/40 ml-1"
              viewBox="0 0 12 12"
              fill="currentColor"
            >
              <path d="M6 8L2 4h8L6 8z" />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
