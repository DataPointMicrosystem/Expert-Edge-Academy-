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
      <div className="bg-academy-gray text-white text-center text-xs py-2.5 px-4 font-medium">
        🔥 Limited time — all courses from{" "}
        <strong className="text-info-blue">₦15,000</strong> for new learners.{" "}
        <a
          href="#courses"
          className="underline underline-offset-2 opacity-75 hover:opacity-100"
        >
          Shop now →
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
