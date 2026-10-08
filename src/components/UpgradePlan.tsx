import { Link } from "react-router";

type UpgradePlanProps = {
  currentPlanId?: string;
};

export default function UpgradePlan(_props: UpgradePlanProps) {
  return (
    <div className="mt-6 border-t border-slate-200 pt-6">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-primary-blue">
            Keep growing
          </p>
          <h3 className="mt-1 text-xl font-black text-[#17213D]">
            Upgrade plan
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Unlock the next learning levels when you are ready.
          </p>
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-slate-600">
        Subscription terms cannot be changed while a plan is active or payment
        is pending. When your current term ends, you can choose another
        available plan.
      </p>
      <Link
        to="/#subscription"
        className="mt-4 inline-flex text-sm font-semibold text-primary-blue underline"
      >
        View available plans
      </Link>
    </div>
  );
}
