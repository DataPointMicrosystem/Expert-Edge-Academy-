import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "learner" as "learner" | "instructor",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const strengthScore = (() => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strengthScore];
  const strengthColor = ["", "bg-error", "bg-warning", "bg-info", "bg-success"][
    strengthScore
  ];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8)
      e.password = "Password must be at least 8 characters";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(form.email, form.name);
      navigate("/");
    }, 1200);
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setErrors((er) => {
        const n = { ...er };
        delete n[key];
        return n;
      });
    },
  });

  return (
    <div className="min-h-screen bg-[#F9F8F5] flex">
      {/* Left — form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-charcoal flex items-center justify-center">
              <svg
                className="w-4 h-4 text-primary-blue"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <span className="font-display font-bold text-lg text-charcoal">
              Expert<span className="text-primary-blue">Edge</span>
            </span>
          </Link>

          <h1 className="font-display font-black text-3xl text-charcoal mb-1">
            Create your account
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-charcoal font-semibold hover:text-primary-blue transition-colors underline underline-offset-2"
            >
              Log in
            </Link>
          </p>

          {/* Role selector */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
            {[
              { v: "learner", label: "I want to learn", icon: "🎓" },
              { v: "instructor", label: "I want to teach", icon: "📚" },
            ].map((r) => (
              <button
                key={r.v}
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    role: r.v as "learner" | "instructor",
                  }))
                }
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  form.role === r.v
                    ? "bg-white text-charcoal shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span>{r.icon}</span>
                {r.label}
              </button>
            ))}
          </div>

          {/* Social */}
          <div className="flex gap-3 mb-5">
            {[
              { label: "Google", icon: "G" },
              { label: "GitHub", icon: "⌥" },
            ].map((s) => (
              <button
                key={s.label}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                <span className="w-5 h-5 rounded font-bold text-xs bg-gray-100 flex items-center justify-center">
                  {s.icon}
                </span>
                Continue with {s.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">
              or sign up with email
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full name
              </label>
              <input
                type="text"
                placeholder="Jane Smith"
                {...field("name")}
                className={`w-full px-4 py-3 rounded-xl border-2 text-sm focus:outline-none transition-colors ${errors.name ? "border-error bg-error/10" : "border-neutral-300 focus:border-primary-blue bg-white"}`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                {...field("email")}
                className={`w-full px-4 py-3 rounded-xl border-2 text-sm focus:outline-none transition-colors ${errors.email ? "border-error bg-error/10" : "border-neutral-300 focus:border-primary-blue bg-white"}`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="At least 8 characters"
                  {...field("password")}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 text-sm focus:outline-none transition-colors ${errors.password ? "border-error bg-error/10" : "border-neutral-300 focus:border-primary-blue bg-white"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${i <= strengthScore ? strengthColor : "bg-gray-200"}`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-xs font-semibold ${strengthScore <= 1 ? "text-error" : strengthScore === 2 ? "text-warning" : strengthScore === 3 ? "text-info" : "text-success"}`}
                  >
                    {strengthLabel}
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-primary-blue text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 shadow-md mt-2"
            >
              {loading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creating account…
                </>
              ) : (
                `Create ${form.role === "instructor" ? "instructor" : "learner"} account`
              )}
            </button>
          </form>

          <p className="text-[10px] text-gray-400 text-center mt-6 leading-relaxed">
            By signing up, you agree to ExpertEdge's{" "}
            <a href="#" className="underline hover:text-gray-600">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-gray-600">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      {/* Right — visual panel */}
      <div className="hidden lg:flex flex-col w-[40%] bg-linear-to-br from-primary-blue to-secondary-blue text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-35">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=900&fit=crop&auto=format"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-br from-primary-blue/80 via-secondary-blue/85 to-deep-blue/95" />

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h2 className="font-display font-black text-4xl xl:text-5xl leading-tight mb-5">
            Start your
            <br />
            learning
            <br />
            journey today.
          </h2>
          <p className="text-[#1B1F3B]/70 text-base max-w-xs leading-relaxed mb-10">
            Join 2.4 million learners already growing their skills and careers
            on ExpertEdge.
          </p>

          <div className="flex flex-col gap-4">
            {[
              { icon: "✓", text: "Lifetime access to courses" },
              { icon: "✓", text: "Downloadable resources & slides" },
              { icon: "✓", text: "30-day money-back guarantee" },
              { icon: "✓", text: "Certificate of completion" },
              { icon: "✓", text: "Learn on any device, anytime" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-charcoal text-primary-blue flex items-center justify-center text-xs font-bold shrink-0">
                  {f.icon}
                </div>
                <span className="text-sm font-semibold text-white">
                  {f.text}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-white/30 rounded-2xl p-5 border border-white/40">
            <div className="flex gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="text-white text-sm">
                  ★
                </span>
              ))}
            </div>
            <p className="text-sm text-white font-medium leading-relaxed">
              "I doubled my salary in 8 months using ExpertEdge. Best investment
              I've ever made."
            </p>
            <div className="flex items-center gap-2 mt-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&auto=format"
                alt=""
                className="w-7 h-7 rounded-full object-cover"
              />
              <span className="text-xs font-bold text-white">
                Marcus Reid · Software Engineer
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
