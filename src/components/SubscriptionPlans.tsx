import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../lib/api";
import {
  SUBSCRIPTION_REFERENCE_KEY,
  subscriptionsApi,
  type SubscriptionPlan,
} from "../lib/subscriptionsApi";
import SubscriptionCard from "./SubscriptionCard";

export default function SubscriptionPlans() {
  const { user, subscription, subscriptionEntitlement, refreshSubscription } =
    useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyPlan, setBusyPlan] = useState("");
  const [error, setError] = useState("");
  const [catalogAttempt, setCatalogAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    subscriptionsApi
      .getPlans()
      .then((response) => active && setPlans(response.data))
      .catch((requestError) => {
        if (!active) return;
        setError(
          requestError instanceof ApiError &&
            requestError.code === "ROUTE_NOT_FOUND"
            ? "The backend is online, but its subscription plans endpoint is not deployed yet. Ask the backend team to deploy GET /api/subscriptions/plans."
            : "We could not connect to the plans service. Check the backend URL and try again.",
        );
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [catalogAttempt]);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      navigate(`/login?redirectTo=${encodeURIComponent("/#subscription")}`);
      return;
    }
    setBusyPlan(planId);
    setError("");
    try {
      const response = await subscriptionsApi.initialize(
        planId,
        `${window.location.origin}/subscriptions/return`,
      );
      sessionStorage.setItem(
        SUBSCRIPTION_REFERENCE_KEY,
        response.data.reference,
      );
      window.location.assign(response.data.authorizationUrl);
    } catch (requestError) {
      if (
        requestError instanceof ApiError &&
        requestError.code === "PLAN_COURSES_UNAVAILABLE"
      ) {
        setError(
          "Courses will be added to this plan later. No payment was started.",
        );
      } else if (
        requestError instanceof ApiError &&
        requestError.code === "SUBSCRIPTION_ALREADY_EXISTS"
      ) {
        try {
          const current = await subscriptionsApi.getMine();
          await refreshSubscription();
          if (
            current.data.subscription?.status === "pending" &&
            current.data.subscription.authorizationUrl
          ) {
            sessionStorage.setItem(
              SUBSCRIPTION_REFERENCE_KEY,
              current.data.subscription.reference,
            );
            window.location.assign(current.data.subscription.authorizationUrl);
            return;
          }
          setError(
            "You already have an active subscription. Review your current plan in your dashboard.",
          );
        } catch {
          setError(
            "Refresh your subscription status before starting another plan.",
          );
        }
      } else if (
        requestError instanceof ApiError &&
        requestError.status === 404 &&
        requestError.code === "PLAN_NOT_FOUND"
      ) {
        try {
          const refreshed = await subscriptionsApi.getPlans();
          setPlans(refreshed.data);
          setError(
            "That plan is no longer available. The plan list has been refreshed.",
          );
        } catch {
          setError(
            "That plan is no longer available. Please refresh the catalog shortly.",
          );
        }
      } else {
        setError("We could not start checkout. Please try again shortly.");
      }
    } finally {
      setBusyPlan("");
    }
  };

  const purchaseBlocked =
    subscription?.status === "pending" || subscription?.status === "active";
  const unsupportedAccount = Boolean(user && user.role !== "learner");

  return (
    <section id="subscription" className="bg-white/65 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-375 px-4 sm:px-6">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-[#154c8c]">
            Learn in the right order
          </p>
          <h2 className="font-display text-3xl font-black tracking-tight text-[#0b1735] sm:text-5xl">
            Pick your next level.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Move from essential computer skills to advanced technical expertise
            with a focused plan that matches where you are today.
          </p>
        </div>

        {loading ? (
          <p className="py-12 text-center text-sm text-slate-500">
            Loading available plans...
          </p>
        ) : error && plans.length === 0 ? (
          <div role="alert" className="mx-auto max-w-xl py-12 text-center">
            <p className="font-semibold text-[#0b1735]">{error}</p>
            <button
              className="mt-3 text-sm font-semibold text-[#154c8c] underline"
              onClick={() => setCatalogAttempt((attempt) => attempt + 1)}
            >
              Try again
            </button>
          </div>
        ) : plans.length === 0 ? (
          <div
            role="status"
            className="mx-auto max-w-xl border-y border-slate-200 py-12 text-center"
          >
            <h3 className="font-display text-xl font-bold text-[#0b1735]">
              Plans are being prepared
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Subscription plans are not available yet. Please check back soon.
            </p>
          </div>
        ) : (
          <>
            {purchaseBlocked && (
              <div className="mb-6 flex flex-col justify-between gap-3 border border-blue-200 bg-blue-50 p-4 sm:flex-row sm:items-center">
                <p className="text-sm text-blue-950">
                  {subscription?.status === "pending"
                    ? "You have a subscription payment in progress. Resume checkout to continue."
                    : `Your ${subscription?.planName} plan is active until ${subscription?.renewalDate ? new Date(subscription.renewalDate).toLocaleDateString() : "the end of its term"}.`}
                </p>
                {subscription?.status === "pending" &&
                  subscription.authorizationUrl && (
                    <a
                      href={subscription.authorizationUrl}
                      onClick={() =>
                        sessionStorage.setItem(
                          SUBSCRIPTION_REFERENCE_KEY,
                          subscription.reference,
                        )
                      }
                      className="shrink-0 text-sm font-bold text-[#154c8c] underline"
                    >
                      Resume checkout
                    </a>
                  )}
              </div>
            )}
            {unsupportedAccount && (
              <p
                role="status"
                className="mb-4 border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
              >
                Subscription checkout is available to student accounts. Sign in
                with a learner account to continue.
              </p>
            )}
            {error && (
              <p role="alert" className="mb-4 text-center text-sm text-red-700">
                {error}
              </p>
            )}
            <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
              {plans.map((plan) => (
                <SubscriptionCard
                  key={plan.planId}
                  plan={plan}
                  onSubscribe={handleSubscribe}
                  disabled={purchaseBlocked || unsupportedAccount}
                  disabledMessage={
                    unsupportedAccount ? "Student accounts only." : undefined
                  }
                  busy={busyPlan === plan.planId}
                  current={
                    subscription?.status === "active" &&
                    subscription.planId === plan.planId
                  }
                />
              ))}
            </div>
          </>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-2 text-center text-xs text-slate-500 sm:flex-row sm:gap-5">
          <span>✓ Self-paced access</span>
          <span>✓ Certificates included</span>
          <span>✓ Progress from Beginner to Advanced</span>
        </div>
      </div>
    </section>
  );
}
