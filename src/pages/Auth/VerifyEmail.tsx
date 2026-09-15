import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../lib/api";
import { notify } from "../../lib/notify";
import expertedgeLogo from "../../asset/expertedgeLogo.jpg";

interface PendingVerification {
  name: string;
  email: string;
  password: string;
  role: "learner" | "instructor";
  redirectTo: string;
}

const readPendingVerification = () => {
  try {
    return JSON.parse(
      localStorage.getItem("pendingEmailVerification") || "null",
    ) as PendingVerification | null;
  } catch {
    return null;
  }
};

export default function VerifyEmail() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pending = readPendingVerification();
  const email =
    pending?.email ||
    new URLSearchParams(location.search).get("email") ||
    "your email address";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!pending) {
      setError("Your verification session has expired. Please sign up again.");
      notify(
        "Your verification session has expired. Please sign up again.",
        "error",
      );
      return;
    }
    setLoading(true);
    try {
      await apiRequest("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ email: pending.email, otp: code.trim() }),
      });
      const signedInUser = await login(pending.email, pending.password);
      localStorage.removeItem("pendingEmailVerification");
      navigate(
        pending.redirectTo !== "/"
          ? pending.redirectTo
          : signedInUser.role === "instructor"
            ? "/facilitator"
            : "/dashboard",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to verify your email.";
      setError(message);
      notify(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (!pending) return;
    try {
      await apiRequest("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email: pending.email }),
      });
      setError("A new verification code has been sent.");
      notify("A new verification code has been sent.", "success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to resend the code.";
      setError(message);
      notify(message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F5] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_24px_70px_rgba(13,23,52,0.08)] sm:p-8">
        <Link to="/" className="mb-8 inline-block">
          <img
            src={expertedgeLogo}
            alt="ExpertEdge Academy"
            className="h-10 w-auto object-contain"
          />
        </Link>

        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-blue">
          Verify your email
        </p>
        <h1 className="mt-3 font-display text-3xl font-black text-charcoal">
          Enter your verification code
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          We sent a six-digit OTP to{" "}
          <span className="font-semibold text-charcoal">{email}</span>.
        </p>

        <div className="mt-6 rounded-2xl border border-primary-blue/20 bg-primary-blue/5 p-4 text-sm text-charcoal">
          <p className="font-semibold">Demo email delivery</p>
          <p className="mt-1 text-gray-600">
            Enter the code from the email to finish creating your account.
          </p>
          <p className="mt-2 text-2xl font-black tracking-[0.3em] text-primary-blue">
            ------
          </p>
        </div>

        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              One-time password
            </label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(event) => {
                setCode(event.target.value.replace(/\D/g, ""));
                setError("");
              }}
              placeholder="000000"
              className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-center text-lg font-bold tracking-[0.4em] text-charcoal focus:outline-none ${error ? "border-error" : "border-neutral-300 focus:border-primary-blue"}`}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary-blue px-4 py-3.5 text-sm font-bold text-white transition-colors hover:bg-deep-blue"
          >
            Verify email and create account
          </button>
        </form>

        <button
          type="button"
          onClick={resendCode}
          className="mt-4 w-full text-sm font-semibold text-charcoal underline underline-offset-2 hover:text-primary-blue"
        >
          Resend code
        </button>
      </div>
    </div>
  );
}
