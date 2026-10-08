import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useLearning } from "../context/useLearning";
import { ApiError } from "../lib/api";
import {
  SUBSCRIPTION_REFERENCE_KEY,
  subscriptionsApi,
} from "../lib/subscriptionsApi";

type PaymentState = "verifying" | "pending" | "success" | "failed" | "missing";

export default function SubscriptionReturn() {
  const { user, refreshSubscription } = useAuth();
  const { refresh: refreshLearning } = useLearning();
  const [state, setState] = useState<PaymentState>("verifying");
  const [message, setMessage] = useState("Confirming your payment securely...");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!user) return;
    let active = true;
    const reference = sessionStorage.getItem(SUBSCRIPTION_REFERENCE_KEY);
    if (!reference) {
      setState("missing");
      setMessage(
        "We could not find this checkout session. Your course access has not changed.",
      );
      return;
    }

    setState("verifying");
    setMessage("Confirming your payment securely...");
    subscriptionsApi
      .verify(reference)
      .then(async (response) => {
        if (!active) return;
        if (response.data.status !== "active") {
          setState("pending");
          setMessage(
            "Your payment is still processing. Access will appear after it is confirmed.",
          );
          return;
        }
        sessionStorage.removeItem(SUBSCRIPTION_REFERENCE_KEY);
        await refreshSubscription();
        await refreshLearning();
        if (active) {
          setState("success");
          setMessage(
            "Payment confirmed. Your subscription and course access are ready.",
          );
        }
      })
      .catch((error) => {
        if (!active) return;
        if (error instanceof ApiError && error.status === 202) {
          setState("pending");
          setMessage(
            "Your payment is still processing. Access will appear after it is confirmed.",
          );
          return;
        }
        setState("failed");
        setMessage(
          error instanceof ApiError && error.status === 402
            ? "We could not confirm this payment. Your access remains locked; you can retry verification or contact support."
            : "We could not verify this payment right now. Your access remains locked; please retry shortly.",
        );
      });

    return () => {
      active = false;
    };
  }, [user?.id, attempt]);

  if (!user) {
    return (
      <Navigate
        to={`/login?redirectTo=${encodeURIComponent("/subscriptions/return")}`}
        replace
      />
    );
  }

  const title = {
    verifying: "Verifying your payment",
    pending: "Payment is processing",
    success: "Subscription confirmed",
    failed: "Payment not confirmed",
    missing: "Checkout session not found",
  }[state];

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-14">
      <section
        aria-live="polite"
        className="w-full max-w-lg border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10"
      >
        <span
          className={`mx-auto flex size-12 items-center justify-center rounded-full text-lg font-bold ${state === "success" ? "bg-emerald-100 text-emerald-700" : state === "failed" || state === "missing" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-800"}`}
        >
          {state === "verifying"
            ? "…"
            : state === "success"
              ? "✓"
              : state === "failed" || state === "missing"
                ? "!"
                : "◷"}
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold text-[#0b1735]">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {(state === "pending" || state === "failed") && (
            <button
              type="button"
              onClick={() => setAttempt((current) => current + 1)}
              className="rounded-lg bg-[#154c8c] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Check again
            </button>
          )}
          {state === "success" ? (
            <Link
              to="/dashboard"
              className="rounded-lg bg-[#154c8c] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Go to dashboard
            </Link>
          ) : (
            <Link
              to="/#subscription"
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700"
            >
              View plans
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
