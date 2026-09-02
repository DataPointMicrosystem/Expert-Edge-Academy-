import { useState } from "react";
import { Link } from "react-router";
import expertedgeLogo from "../../asset/expertedgeLogo.jpg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F5] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_24px_70px_rgba(13,23,52,0.08)] sm:p-8">
        <Link to="/" className="inline-block mb-6">
          <img
            src={expertedgeLogo}
            alt="ExpertEdge Academy"
            className="h-10 w-auto object-contain"
          />
        </Link>

        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-blue">
            Account recovery
          </p>
          <h1 className="mt-3 font-display text-3xl font-black text-charcoal">
            Forgot your password?
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Enter the email address linked to your account and we’ll send you a
            reset link.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-success/20 bg-success/10 p-4 text-sm text-success">
            We’ve sent a password reset link to{" "}
            <span className="font-semibold">{email}</span>.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="you@example.com"
                className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-gray-400 focus:outline-none ${
                  error
                    ? "border-error"
                    : "border-neutral-300 focus:border-primary-blue"
                }`}
              />
              {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-primary-blue px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-deep-blue"
            >
              Send reset link
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-charcoal hover:text-primary-blue"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
