import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
  SUBSCRIPTION_REFERENCE_KEY,
  subscriptionsApi,
  type SubscriptionPlan,
} from "../lib/subscriptionsApi";
import { formatNaira } from "../lib/money";

function formatDate(date: string | null | undefined) {
  return date ? new Date(date).toLocaleDateString() : "Not started";
}

export default function MySubscription() {
  const {
    subscription,
    subscriptionEntitlement,
    subscriptionLoading,
    refreshSubscription,
  } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  useEffect(() => {
    subscriptionsApi
      .getPlans()
      .then((response) => setPlans(response.data))
      .catch(() => setPlans([]));
  }, []);

  const plan = plans.find((item) => item.planId === subscription?.planId);

  if (subscriptionLoading) {
    return (
      <section className="mb-8 border border-slate-200 bg-white p-5 text-sm text-slate-500 sm:p-6">
        Loading your subscription...
      </section>
    );
  }

  return (
    <section className="mb-8 border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-semibold text-primary-blue">Your plan</p>
          <h2 className="mt-1 font-display text-2xl font-black text-[#17213D]">
            My subscription
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Subscription status and access are confirmed by ExpertEdge Academy.
          </p>
        </div>
        {subscription && (
          <span
            className={`inline-flex w-fit items-center rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-wider ${subscription.status === "active" && subscriptionEntitlement.active ? "bg-emerald-50 text-emerald-700" : subscription.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}
          >
            {subscription.status === "active" && subscriptionEntitlement.active
              ? "Active"
              : subscription.status}
          </span>
        )}
      </div>

      {!subscription ? (
        <div className="mt-6 border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-600">
            You do not have a subscription yet.
          </p>
          <Link
            to="/#subscription"
            className="mt-4 inline-flex rounded-lg bg-primary-blue px-4 py-2.5 text-sm font-semibold text-white"
          >
            Browse plans
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border border-slate-200 bg-slate-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Current plan
              </p>
              <p className="mt-2 text-lg font-black text-[#17213D]">
                {subscription.planName}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {subscription.planId}
              </p>
            </div>
            <div className="border border-slate-200 bg-slate-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Price
              </p>
              <p className="mt-2 text-lg font-black text-[#17213D]">
                {formatNaira(subscription.amount)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {subscription.currency}
              </p>
            </div>
            <div className="border border-slate-200 bg-slate-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Started
              </p>
              <p className="mt-2 text-lg font-black text-[#17213D]">
                {formatDate(subscription.startedAt)}
              </p>
              <p className="mt-1 text-xs text-slate-500">Subscription date</p>
            </div>
            <div className="border border-slate-200 bg-slate-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Courses included
              </p>
              <p className="mt-2 text-lg font-black text-[#17213D]">
                {subscriptionEntitlement.active
                  ? subscriptionEntitlement.courses.length
                  : 0}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Access ends: {formatDate(subscription.renewalDate)}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-[#17213D]">
                {subscriptionEntitlement.active
                  ? "Courses included with your access"
                  : "Included courses"}
              </h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {(subscriptionEntitlement.active
                  ? subscriptionEntitlement.courses
                  : (plan?.courses ?? [])
                ).map((course) => (
                  <li
                    key={course._id || course.slug}
                    className="flex gap-2 text-sm text-slate-600"
                  >
                    <span
                      className="font-black text-emerald-600"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    {course.title}
                  </li>
                ))}
              </ul>
              {!subscriptionEntitlement.active &&
                (plan?.plannedCourseTitles.length ?? 0) > 0 && (
                  <>
                    <p className="mt-4 text-xs font-semibold text-slate-500">
                      Planned topics only; these are not active course access.
                    </p>
                    <ul className="mt-2 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
                      {plan?.plannedCourseTitles.map((title) => (
                        <li key={title}>{title}</li>
                      ))}
                    </ul>
                  </>
                )}
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-[#17213D]">
                Plan benefits
              </h3>
              <ul className="mt-3 space-y-2">
                {(plan?.benefits ?? []).map((benefit) => (
                  <li
                    key={benefit}
                    className="flex gap-2 text-sm text-slate-600"
                  >
                    <span
                      className="font-black text-[#f0a800]"
                      aria-hidden="true"
                    >
                      +
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {subscription.status === "pending" &&
            subscription.authorizationUrl && (
              <a
                href={subscription.authorizationUrl}
                onClick={() =>
                  sessionStorage.setItem(
                    SUBSCRIPTION_REFERENCE_KEY,
                    subscription.reference,
                  )
                }
                className="mt-6 inline-flex rounded-lg bg-primary-blue px-4 py-2.5 text-sm font-semibold text-white"
              >
                Resume secure checkout
              </a>
            )}
          {subscription.status === "pending" && (
            <button
              onClick={() => void refreshSubscription()}
              className="ml-3 mt-6 text-sm font-semibold text-primary-blue underline"
            >
              Refresh status
            </button>
          )}
          {(subscription.status === "expired" ||
            subscription.status === "failed" ||
            subscription.status === "abandoned") && (
            <Link
              to="/#subscription"
              className="mt-6 inline-flex rounded-lg bg-primary-blue px-4 py-2.5 text-sm font-semibold text-white"
            >
              Choose a plan
            </Link>
          )}
          {!subscriptionEntitlement.active &&
            subscription.status === "active" && (
              <p className="mt-5 text-sm text-amber-800">
                Your access is not active yet. Refresh your subscription status
                or contact support.
              </p>
            )}
        </>
      )}
    </section>
  );
}
