import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      login(form.email, form.email.split("@")[0]);
      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F5] flex">
      {/* Left — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-[#1B1F3B] to-[#0e1020] text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=900&fit=crop&auto=format" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B1F3B]/60 to-[#1B1F3B]/95" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#F5A623] flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-[#1B1F3B]" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <span className="font-display font-bold text-xl">Expert<span className="text-[#F5A623]">Edge</span></span>
          </Link>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          <h2 className="font-display font-black text-4xl xl:text-5xl leading-tight mb-5">
            Welcome back.<br />
            <span className="text-[#F5A623]">Keep learning.</span>
          </h2>
          <p className="text-white/60 text-base max-w-sm leading-relaxed">
            Pick up right where you left off. Your courses, notes, and progress are all waiting for you.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            {[
              { icon: "🎓", title: "2.4M+ learners", sub: "Across 190 countries" },
              { icon: "🏆", title: "68,000+ courses", sub: "Updated monthly" },
              { icon: "💼", title: "Certificate included", sub: "Shareable on LinkedIn" },
            ].map((f) => (
              <div key={f.title} className="flex items-center gap-3 bg-white/8 rounded-xl px-4 py-3 border border-white/10">
                <span className="text-xl">{f.icon}</span>
                <div>
                  <p className="text-sm font-semibold">{f.title}</p>
                  <p className="text-xs text-white/50">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex gap-1 items-center text-xs text-white/30">
          <span>© 2024 ExpertEdge Academy</span>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-[#1B1F3B] flex items-center justify-center">
              <svg className="w-4 h-4 text-[#F5A623]" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <span className="font-display font-bold text-lg text-[#1B1F3B]">Expert<span className="text-[#F5A623]">Edge</span></span>
          </Link>

          <h1 className="font-display font-black text-3xl text-[#1B1F3B] mb-1">Log in to your account</h1>
          <p className="text-gray-500 text-sm mb-8">
            New to ExpertEdge?{" "}
            <Link to="/signup" className="text-[#1B1F3B] font-semibold hover:text-[#F5A623] transition-colors underline underline-offset-2">
              Sign up free
            </Link>
          </p>

          {/* Social login */}
          <div className="flex gap-3 mb-6">
            {[
              { label: "Continue with Google", icon: "G" },
              { label: "Continue with GitHub", icon: "⌥" },
            ].map((s) => (
              <button key={s.label} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all">
                <span className="w-5 h-5 rounded font-bold text-xs bg-gray-100 flex items-center justify-center">{s.icon}</span>
                <span className="hidden sm:block truncate">{s.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => { setForm((f) => ({ ...f, email: e.target.value })); setErrors((er) => ({ ...er, email: undefined })); }}
                className={`w-full px-4 py-3 rounded-xl border-2 text-sm focus:outline-none transition-colors ${
                  errors.email ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#1B1F3B] bg-white"
                }`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <button type="button" className="text-xs text-[#1B1F3B] font-semibold hover:text-[#F5A623] transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => { setForm((f) => ({ ...f, password: e.target.value })); setErrors((er) => ({ ...er, password: undefined })); }}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 text-sm focus:outline-none transition-colors ${
                    errors.password ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#1B1F3B] bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPass ? (
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" /></svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#1B1F3B] text-white font-bold text-sm hover:bg-[#252a4a] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-md mt-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <p className="text-[10px] text-gray-400 text-center mt-6 leading-relaxed">
            By logging in, you agree to ExpertEdge's{" "}
            <a href="#" className="underline hover:text-gray-600">Terms of Service</a> and{" "}
            <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
