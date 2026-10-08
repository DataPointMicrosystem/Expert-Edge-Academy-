import type { SubscriptionPlan } from "../lib/subscriptionsApi";
import { formatNaira } from "../lib/money";

type SubscriptionCardProps = {
  plan: SubscriptionPlan;
  onSubscribe: (planId: string) => void;
  disabled?: boolean;
  disabledMessage?: string;
  busy?: boolean;
  current?: boolean;
};

const accentStyles: Record<string, string> = {
  blue: "bg-blue-50 text-[#154c8c]",
  teal: "bg-teal-50 text-teal-700",
  gold: "bg-[#fff4d6] text-[#9a6500]",
  navy: "bg-slate-100 text-[#0b1735]",
} as const;

export default function SubscriptionCard({
  plan,
  onSubscribe,
  disabled = false,
  disabledMessage,
  busy = false,
  current = false,
}: SubscriptionCardProps) {
  const accentStyle = accentStyles[plan.accent] ?? accentStyles.navy;
  const courses = plan.courses;
  const listedCourseTitles = courses.length
    ? courses.map((course) => ({
        key: course._id || course.slug,
        title: course.title,
      }))
    : plan.plannedCourseTitles.map((title) => ({ key: title, title }));
  return (
    <article
      className={`relative flex h-full flex-col rounded-[24px] border bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.13)] ${plan.popular ? "border-[#f0b84d] ring-2 ring-[#f7d28b]" : "border-slate-200/90"}`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-6 rounded-full bg-[#f7b955] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#0b1735] shadow-sm">
          Most popular
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            {plan.level}
          </p>
          <h3 className="mt-2 font-display text-2xl font-black text-[#0b1735]">
            {plan.name}
          </h3>
        </div>
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-black ${accentStyle}`}
          aria-hidden="true"
        >
          {plan.name[0]}
        </span>
      </div>

      <p className="mt-4 min-h-18 text-sm leading-6 text-slate-600">
        {plan.description}
      </p>

      <div className="mt-5 border-y border-slate-200/80 py-4">
        <div className="flex items-end gap-2">
          <span className="font-display text-3xl font-black text-[#0b1735]">
            {formatNaira(plan.price)}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          {plan.billingInterval === "one_time" ? "One-time payment · " : ""}
          {plan.durationMonths} {plan.durationMonths === 1 ? "month" : "months"}{" "}
          access
        </p>
        <p className="mt-1 text-xs font-semibold text-[#154c8c]">
          {plan.courses.length
            ? `${plan.courses.length} courses included`
            : `${plan.plannedCourseTitles.length} courses planned`}
        </p>
      </div>

      <div className="mt-5">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#0b1735]">
          {courses.length ? "Included courses" : "Planned courses"}
        </p>
        <ul className="space-y-2.5">
          {listedCourseTitles.map((course) => (
            <li
              key={course.key}
              className="flex gap-2 text-sm leading-5 text-slate-600"
            >
              <span
                className={`mt-0.5 shrink-0 font-black ${courses.length ? "text-[#117a5c]" : "text-slate-400"}`}
                aria-hidden="true"
              >
                {courses.length ? "✓" : "·"}
              </span>
              <span>{course.title}</span>
            </li>
          ))}
        </ul>
        {!courses.length && (
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Suggested topics only. Course access is not included until courses
            are assigned.
          </p>
        )}
      </div>

      <div className="mt-6 border-t border-slate-200/80 pt-5">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#0b1735]">
          Plan benefits
        </p>
        <ul className="space-y-2 text-xs text-slate-500">
          {(plan.benefits.length ? plan.benefits : plan.features).map(
            (benefit) => (
              <li key={benefit} className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-[#f7b955]"
                  aria-hidden="true"
                />
                {benefit}
              </li>
            ),
          )}
        </ul>
      </div>

      {(!plan.isPurchasable || disabled) && (
        <p className="mt-5 text-xs leading-5 text-amber-800">
          {current
            ? "This is your current plan."
            : plan.availabilityMessage ||
              disabledMessage ||
              (disabled
                ? "A subscription is already active or pending on your account."
                : "This plan is not available for checkout yet.")}
        </p>
      )}
      <button
        type="button"
        disabled={!plan.isPurchasable || disabled || busy}
        onClick={() => onSubscribe(plan.planId)}
        className={`mt-7 w-full rounded-xl px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${plan.popular ? "bg-[#154c8c] text-white shadow-[0_14px_28px_rgba(21,76,140,0.22)] hover:bg-[#0b1735]" : "border border-[#154c8c] text-[#154c8c] hover:bg-[#154c8c] hover:text-white"}`}
      >
        {busy
          ? "Starting secure checkout..."
          : !plan.isPurchasable
            ? "Coming soon"
            : current
              ? "Current plan"
              : "Subscribe now"}
      </button>
    </article>
  );
}
