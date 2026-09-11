import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div>
      {/* Announcement bar */}
      <div className="flex items-center justify-center gap-2 bg-[#0b1735] px-4 py-2.5 text-center text-xs font-medium text-white/80">
        <span className="text-[#f7b955]" aria-hidden="true">✦</span>
        <span>Limited time — all courses from{" "}
        <strong className="text-[#f7b955]">₦15,000</strong> for new learners.</span>{" "}
        <a
          href="#courses"
          className="font-bold text-white underline decoration-[#f7b955] underline-offset-2 transition hover:text-[#f7b955]"
        >
          Shop now
        </a>
      </div>
      <Navbar />
      <div>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
