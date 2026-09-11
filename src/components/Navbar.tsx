import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import expertedgeLogo from "../asset/expertedgeLogo.jpg";
import ExploreDropdown from "./ExploreDropdown";
import TeachDropdown from "./TeachDropdown";

export default function Navbar() {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-[0_10px_30px_rgba(11,23,53,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-375 items-center gap-5 px-4 sm:gap-8 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src={expertedgeLogo}
            alt="ExpertEdge Academy"
            className="h-9 w-auto object-contain sm:h-10"
          />
        </Link>

        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-200"
        >
          <div className="relative w-full">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="9" cy="9" r="6" />
              <path d="M15 15l3 3" strokeLinecap="round" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search for courses"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-500 focus:border-primary-blue focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </form>

        <nav className="hidden lg:flex items-center gap-1 ml-2">
          <ExploreDropdown />
          <TeachDropdown />
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <Link
            to="/cart"
            aria-label={`Shopping cart${count > 0 ? `, ${count} items` : ""}`}
            className="relative rounded-xl p-2.5 text-slate-700 hover:bg-slate-100"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-blue text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-blue text-sm font-bold text-white shadow-sm"
                title="Open dashboard"
              >
                {user.name[0]}
              </Link>
              <Link
                to="/dashboard"
                className="hidden text-sm font-semibold text-slate-700 hover:text-primary-blue sm:block"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="hidden sm:block text-sm text-slate-600 hover:text-slate-900"
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:block text-sm font-semibold px-4 py-2 rounded-xl border border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold px-4 py-2.5 rounded-xl bg-primary-blue text-white shadow-[0_10px_25px_rgba(21,76,140,0.22)] hover:-translate-y-px hover:shadow-[0_12px_30px_rgba(21,76,140,0.28)]"
              >
                Sign up
              </Link>
            </>
          )}

          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-neutral-300 px-4 py-4 bg-white flex flex-col gap-3">
          <form onSubmit={handleSearch} className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="9" cy="9" r="6" />
              <path d="M15 15l3 3" strokeLinecap="round" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search courses…"
              className="w-full pl-9 pr-4 py-2.5 rounded-full border border-neutral-300 bg-neutral-100 text-sm focus:outline-none"
            />
          </form>
          <Link
            to="/"
            className="py-2 text-sm font-medium text-neutral-700"
            onClick={() => setMobileOpen(false)}
          >
            Explore
          </Link>
          <Link
            to="/signup?role=instructor"
            className="py-2 text-sm font-medium text-neutral-700"
            onClick={() => setMobileOpen(false)}
          >
            Teach
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className="py-2 text-sm font-semibold text-primary-blue"
              onClick={() => setMobileOpen(false)}
            >
              My dashboard
            </Link>
          )}
          {!user && (
            <div className="flex gap-2 pt-1">
              <Link
                to="/login"
                className="flex-1 py-2.5 text-sm text-center rounded-full border-2 border-primary-blue text-primary-blue font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="flex-1 py-2.5 text-sm text-center rounded-full bg-primary-blue text-white font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
