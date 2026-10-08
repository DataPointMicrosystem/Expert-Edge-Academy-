import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { apiRequest } from "../../lib/api";

interface PendingVerification {
  name: string;
  email: string;
  role: "learner" | "instructor";
  redirectTo: string;
}

const readPendingVerification = () => {
  try {
    return JSON.parse(
      sessionStorage.getItem("pendingEmailVerification") || "null",
    ) as PendingVerification | null;
  } catch {
    return null;
  }
};

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const pending = readPendingVerification();
  const params = new URLSearchParams(location.search);
  const email = pending?.email || params.get("email") || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    localStorage.removeItem("pendingEmailVerification");
  }, []);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = window.setTimeout(
      () => setResendCountdown((countdown) => countdown - 1),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [resendCountdown]);

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email) {
      setError(
        "Enter the email address where you received your verification code.",
      );
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the six-digit code from your email.");
      return;
    }
    setLoading(true);
    setError("");
    setNotice("");
    try {
      await apiRequest("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ email, otp: code.trim() }),
      });
      sessionStorage.removeItem("pendingEmailVerification");
      localStorage.removeItem("pendingEmailVerification");
      const loginParams = new URLSearchParams({ email, verified: "1" });
      const redirectTo = pending?.redirectTo || params.get("redirectTo");
      if (redirectTo) loginParams.set("redirectTo", redirectTo);
      navigate(`/login?${loginParams.toString()}`, { replace: true });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "We could not verify this code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (!email || resending || resendCountdown > 0) return;
    setResending(true);
    setError("");
    setNotice("");
    try {
      await apiRequest("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setNotice("A new verification email has been sent.");
      setResendCountdown(30);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "We could not resend the verification email. Please try again.",
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7fa] px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_24px_70px_rgba(13,23,52,0.08)] sm:p-9">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-lg font-black tracking-tight text-[#0b1735]"
        >
          <span
            className="flex size-8 items-center justify-center rounded-lg bg-[#154c8c] text-sm text-white"
            aria-hidden="true"
          >
            E
          </span>
          ExpertEdge <span className="font-medium text-slate-500">Academy</span>
        </Link>

        <div
          className="mt-9 flex size-12 items-center justify-center rounded-full bg-blue-50 text-[#154c8c]"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="size-6"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m4 7 8 6 8-6" />
          </svg>
        </div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#154c8c]">
          Email verification
        </p>
        <h1 className="mt-2 font-display text-3xl font-black leading-tight text-[#0b1735]">
          Check your inbox
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Enter the six-digit code sent to{" "}
          {email ? (
            <span className="font-semibold text-[#0b1735]">{email}</span>
          ) : (
            "your email address"
          )}
          .
        </p>

        <form onSubmit={handleVerify} className="mt-7 space-y-5">
          <div>
            <label
              htmlFor="verification-code"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Verification code
            </label>
            <input
              id="verification-code"
              name="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              disabled={!email || loading}
              value={code}
              onChange={(event) => {
                setCode(event.target.value.replace(/\D/g, "").slice(0, 6));
                setError("");
              }}
              placeholder="Enter code"
              aria-describedby={error ? "verification-error" : undefined}
              aria-invalid={Boolean(error)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-center text-xl font-bold tracking-[0.35em] text-[#0b1735] outline-none transition placeholder:text-sm placeholder:font-medium placeholder:tracking-normal focus:border-[#154c8c] focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50"
            />
            {error && (
              <p
                id="verification-error"
                role="alert"
                className="mt-2 text-sm text-red-700"
              >
                {error}
              </p>
            )}
            {notice && (
              <p role="status" className="mt-2 text-sm text-emerald-700">
                {notice}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!email || code.length !== 6 || loading}
            className="w-full rounded-xl bg-[#154c8c] px-4 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#0b1735] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#154c8c] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify email"}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-5 text-center">
          <p className="text-sm text-slate-600">Didn’t receive the email?</p>
          <button
            type="button"
            onClick={resendCode}
            disabled={!email || resending || resendCountdown > 0}
            className="mt-2 text-sm font-semibold text-[#154c8c] underline underline-offset-4 hover:text-[#0b1735] disabled:cursor-not-allowed disabled:text-slate-400"
          >
            {resending
              ? "Sending..."
              : resendCountdown > 0
                ? `Resend available in ${resendCountdown}s`
                : "Resend verification email"}
          </button>
          <p className="mt-5 text-xs text-slate-500">
            Wrong email address?{" "}
            <Link
              to="/signup"
              className="font-semibold text-[#154c8c] underline"
            >
              Start again
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
