import { getUpgradePlans, type SubscriptionPlan } from "../data/subscriptionPlans";
import { formatNaira } from "../lib/money";

type UpgradePlanProps = {
  currentPlanId: string;
  onUpgrade: (plan: SubscriptionPlan) => void;
};

export default function UpgradePlan({
  currentPlanId,
  onUpgrade,
}: UpgradePlanProps) {
  const upgradePlans = getUpgradePlans(currentPlanId);

  return (
    <div className="mt-6 border-t border-slate-200 pt-6">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-primary-blue">Keep growing</p>
          <h3 className="mt-1 text-xl font-black text-[#17213D]">Upgrade plan</h3>
          <p className="mt-1 text-sm text-slate-500">
            Unlock the next learning levels when you are ready.
          </p>
        </div>
      </div>

      {upgradePlans.length === 0 ? (
        <p className="mt-5 border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          You're currently on our highest plan.
        </p>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {upgradePlans.map((plan) => (
            <article
              key={plan.id}
              className="border border-slate-200 bg-slate-50 p-4 transition hover:border-primary-blue hover:bg-white"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                    {plan.level}
                  </p>
                  <h4 className="mt-1 font-display text-xl font-black text-[#17213D]">
                    {plan.name}
                  </h4>
                </div>
                {plan.popular && (
                  <span className="rounded-full bg-[#fff4d6] px-2 py-1 text-[10px] font-black uppercase tracking-wider text-[#9a6500]">
                    Recommended
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm font-bold text-primary-blue">
                {formatNaira(plan.price)} / {plan.duration}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                {plan.courses.length} courses · {plan.benefits.join(" · ")}
              </p>
              <button
                type="button"
                onClick={() => onUpgrade(plan)}
                className="mt-4 w-full rounded-xl bg-primary-blue px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0b1735]"
              >
                Upgrade to {plan.name}
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
