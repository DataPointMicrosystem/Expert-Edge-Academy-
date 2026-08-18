import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-3 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#1B1F3B] flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-[#F5A623]" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-[#1B1F3B] hidden sm:block">
            Expert<span className="text-[#F5A623]">Edge</span>
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg">
          <div className="relative w-full">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="9" cy="9" r="6" />
              <path d="M15 15l3 3" strokeLinecap="round" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search for anything"
              className="w-full pl-10 pr-4 py-2.5 rounded-full border-2 border-gray-200 focus:border-[#1B1F3B] bg-gray-50 text-sm focus:outline-none focus:bg-white transition-all placeholder:text-gray-400"
            />
          </div>
        </form>

        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-1 ml-2">
          <Link to="/" className="text-sm font-medium px-3 py-2 rounded-lg text-gray-600 hover:text-[#1B1F3B] hover:bg-gray-100 transition-colors">
            Explore
          </Link>
          <Link to="/teach" className="text-sm font-medium px-3 py-2 rounded-lg text-gray-600 hover:text-[#1B1F3B] hover:bg-gray-100 transition-colors">
            Teach
          </Link>
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          {/* Cart */}
          <Link to="/cart" className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#F5A623] text-[#1B1F3B] text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1B1F3B] text-white flex items-center justify-center text-sm font-bold">
                {user.name[0]}
              </div>
              <button
                onClick={logout}
                className="hidden sm:block text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:block text-sm font-semibold px-4 py-2 rounded-full border-2 border-[#1B1F3B] text-[#1B1F3B] hover:bg-[#1B1F3B] hover:text-white transition-all"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold px-4 py-2 rounded-full bg-[#F5A623] text-[#1B1F3B] hover:opacity-90 transition-opacity shadow-sm"
              >
                Sign up
              </Link>
            </>
          )}

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 px-4 py-4 bg-white flex flex-col gap-3">
          <form onSubmit={handleSearch} className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="9" cy="9" r="6" />
              <path d="M15 15l3 3" strokeLinecap="round" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search courses…"
              className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none"
            />
          </form>
          <Link to="/" className="py-2 text-sm font-medium text-gray-700" onClick={() => setMobileOpen(false)}>Explore</Link>
          <Link to="/teach" className="py-2 text-sm font-medium text-gray-700" onClick={() => setMobileOpen(false)}>Teach</Link>
          {!user && (
            <div className="flex gap-2 pt-1">
              <Link to="/login" className="flex-1 py-2.5 text-sm text-center rounded-full border-2 border-[#1B1F3B] font-semibold" onClick={() => setMobileOpen(false)}>Log in</Link>
              <Link to="/signup" className="flex-1 py-2.5 text-sm text-center rounded-full bg-[#F5A623] text-[#1B1F3B] font-semibold" onClick={() => setMobileOpen(false)}>Sign up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
