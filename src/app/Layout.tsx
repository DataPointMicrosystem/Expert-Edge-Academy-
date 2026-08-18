import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

export default function Layout() {
  return (
    <div>
      {/* Announcement bar */}
      <div className="bg-[#1B1F3B] text-white text-center text-xs py-2.5 px-4 font-medium">
        🔥 Limited time — all courses from{" "}
        <strong className="text-[#F5A623]">$9.99</strong> for new learners.{" "}
        <a
          href="#courses"
          className="underline underline-offset-2 opacity-75 hover:opacity-100"
        >
          Shop now →
        </a>
      </div>
      <Navbar />
      <Outlet />
    </div>
  );
}
