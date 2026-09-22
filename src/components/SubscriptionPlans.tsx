import { SUBSCRIPTION_PLANS, type SubscriptionPlan } from "../data/subscriptionPlans";
import { useAuth } from "../context/AuthContext";
import { notify } from "../lib/notify";
import SubscriptionCard from "./SubscriptionCard";

export default function SubscriptionPlans() {
  const { user, setSubscriptionPlan } = useAuth();

  const handleSubscribe = (plan: SubscriptionPlan) => {
    if (user) {
      setSubscriptionPlan(plan.id as Parameters<typeof setSubscriptionPlan>[0]);
      notify(
        `${plan.name} selected in demo mode. Connect payment before activating paid access.`,
        "info",
      );
      return;
    }
    notify(
      "Sign in before selecting a subscription plan.",
      "info",
    );
  };

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

        <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <SubscriptionCard
              key={plan.name}
              plan={plan}
              onSubscribe={handleSubscribe}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-2 text-center text-xs text-slate-500 sm:flex-row sm:gap-5">
          <span>✓ Self-paced access</span>
          <span>✓ Certificates included</span>
          <span>✓ Progress from Beginner to Advanced</span>
        </div>
      </div>
    </section>
  );
}