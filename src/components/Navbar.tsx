import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import expertedgeLogo from "../asset/expertedgeLogo.jpg";

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
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-3 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src={expertedgeLogo}
            alt="ExpertEdge Academy"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-lg"
        >
          <div className="relative w-full">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600"
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
              placeholder="Search for anything"
              className="w-full pl-10 pr-4 py-2.5 rounded-full border-2 border-neutral-300 focus:border-primary-blue bg-neutral-100 text-sm focus:outline-none focus:bg-white transition-all placeholder:text-neutral-600"
            />
          </div>
        </form>

        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-1 ml-2">
          <Link
            to="/"
            className="text-sm font-medium px-3 py-2 rounded-lg text-neutral-700 hover:text-primary-blue hover:bg-neutral-100 transition-colors"
          >
            Explore
          </Link>
          <Link
            to="/teach"
            className="text-sm font-medium px-3 py-2 rounded-lg text-neutral-700 hover:text-primary-blue hover:bg-neutral-100 transition-colors"
          >
            Teach
          </Link>
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2.5 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            <svg
              className="w-5 h-5 text-charcoal"
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
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-blue text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-blue text-white flex items-center justify-center text-sm font-bold">
                {user.name[0]}
              </div>
              <button
                onClick={logout}
                className="hidden sm:block text-sm text-neutral-500 hover:text-charcoal transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:block text-sm font-semibold px-4 py-2 rounded-full border-2 border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white transition-all"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold px-4 py-2 rounded-full bg-primary-blue text-white hover:opacity-90 transition-opacity shadow-sm"
              >
                Sign up
              </Link>
            </>
          )}

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100"
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
            to="/teach"
            className="py-2 text-sm font-medium text-neutral-700"
            onClick={() => setMobileOpen(false)}
          >
            Teach
          </Link>
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
