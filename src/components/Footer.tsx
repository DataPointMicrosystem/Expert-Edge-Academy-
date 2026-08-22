import { Link } from "react-router";
import Logo from "../asset/expertedgeLogo.jpg";

export default function Footer() {
  const getCurrentYear = () => {
    const date = new Date();
    return date.getFullYear();
  };
  return (
    <footer className="bg-[#1B1F3B] text-white pt-14 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img
                src={Logo}
                alt="Expert Edge Academy"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-white/50 leading-relaxed">
              Online learning that opens doors and creates lasting
              opportunities.
            </p>
            <div className="flex gap-3 mt-4">
              {["𝕏", "in", "▶", "📸"].map((icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs transition-colors"
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
                    <a
                      href="#"
                      className="text-xs text-white/60 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
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
