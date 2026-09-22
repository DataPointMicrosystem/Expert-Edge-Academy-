import { useAuth } from "../context/AuthContext";
import {
  getSubscriptionPlan,
  type SubscriptionPlan,
} from "../data/subscriptionPlans";
import { formatNaira } from "../lib/money";
import { notify } from "../lib/notify";
import UpgradePlan from "./UpgradePlan";

function formatDate(date: string | null) {
  return date ? new Date(date).toLocaleDateString() : "No renewal date";
}

export default function MySubscription() {
  const { subscription, setSubscriptionPlan } = useAuth();
  const plan = getSubscriptionPlan(subscription.planId);

  const handleUpgrade = (nextPlan: SubscriptionPlan) => {
    setSubscriptionPlan(nextPlan.id as Parameters<typeof setSubscriptionPlan>[0]);
    notify(
      `${nextPlan.name} selected in demo mode. Connect payment before activating paid access.`,
      "info",
    );
  };

  return (
    <section className="mb-8 border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-semibold text-primary-blue">Your plan</p>
          <h2 className="mt-1 font-display text-2xl font-black text-[#17213D]">
            My subscription
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Your learning access and available upgrades are managed here.
          </p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-amber-700">
          {subscription.status === "pending" ? "Payment pending" : "Active"}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border border-slate-200 bg-slate-50 p-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Current plan
          </p>
          <p className="mt-2 text-lg font-black text-[#17213D]">{plan.name}</p>
          <p className="mt-1 text-xs text-slate-500">{plan.level}</p>
        </div>
        <div className="border border-slate-200 bg-slate-50 p-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Price
          </p>
          <p className="mt-2 text-lg font-black text-[#17213D]">
            {plan.price === 0 ? "Free" : formatNaira(plan.price)}
          </p>
          <p className="mt-1 text-xs text-slate-500">{plan.duration}</p>
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
          <p className="mt-2 text-lg font-black text-[#17213D]">{plan.courses.length}</p>
          <p className="mt-1 text-xs text-slate-500">
            Renewal: {formatDate(subscription.renewalDate)}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-[#17213D]">
            Courses included in {plan.name}
          </h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {plan.courses.map((course) => (
              <li key={course} className="flex gap-2 text-sm text-slate-600">
                <span className="font-black text-emerald-600" aria-hidden="true">
                  ✓
                </span>
                {course}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-[#17213D]">
            Main benefits
          </h3>
          <ul className="mt-3 space-y-2">
            {plan.benefits.map((benefit) => (
              <li key={benefit} className="flex gap-2 text-sm text-slate-600">
                <span className="font-black text-[#f0a800]" aria-hidden="true">
                  +
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <UpgradePlan currentPlanId={subscription.planId} onUpgrade={handleUpgrade} />
    </section>
  );
}
