import { Link, Navigate, useNavigate } from "react-router";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatNaira } from "../lib/money";

export default function Checkout() {
  const { items, total } = useCart();
  const { user, enroll } = useAuth();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  if (!user) {
    return (
      <Navigate
        to={`/login?redirectTo=${encodeURIComponent("/checkout")}`}
        replace
      />
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] bg-slate-50 px-4 py-16 sm:px-6">
        <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-[#0b1735]">
            Your cart is empty
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Add a course before checking out.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-xl bg-primary-blue px-5 py-3 text-sm font-semibold text-white"
          >
            Explore courses
          </Link>
        </section>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-[70vh] bg-slate-50 px-4 py-16 sm:px-6">
        <section className="mx-auto max-w-xl rounded-2xl border border-emerald-200 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            ✓
          </div>
          <h1 className="mt-5 text-2xl font-bold text-[#0b1735]">
            Enrollment confirmed
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Your courses are ready, {user.name}. This demo checkout does not
            process a real payment.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-xl bg-primary-blue px-5 py-3 text-sm font-semibold text-white"
          >
            Return home
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-slate-50 px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary-blue">
            Secure checkout
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[#0b1735] sm:text-4xl">
            Complete your enrollment
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Signed in as {user.email}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              enroll(
                items.map((item) => item.id),
                items.map((item) => ({
                  courseId: item.id,
                  title: item.title,
                  amount: item.price,
                  purchasedAt: new Date().toISOString(),
                })),
              );
              const firstCourseId = items[0].id;
              navigate(`/courses/${firstCourseId}/lessons`);
              setSubmitted(true);
            }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 className="text-lg font-bold text-[#0b1735]">
              Payment details
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2 text-sm font-semibold text-slate-700">
                Cardholder name
                <input
                  required
                  type="text"
                  defaultValue={user.name}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-primary-blue"
                />
              </label>
              <label className="sm:col-span-2 text-sm font-semibold text-slate-700">
                Card number
                <input
                  required
                  inputMode="numeric"
                  pattern="[0-9 ]{12,19}"
                  placeholder="1234 5678 9012 3456"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-primary-blue"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Expiry date
                <input
                  required
                  placeholder="MM / YY"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-primary-blue"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                CVV
                <input
                  required
                  inputMode="numeric"
                  pattern="[0-9]{3,4}"
                  placeholder="123"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-primary-blue"
                />
              </label>
            </div>
            <button
              type="submit"
              className="mt-8 w-full rounded-xl bg-primary-blue px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#0b1735]"
            >
              Pay {formatNaira(total)}
            </button>
          </form>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#0b1735]">Order summary</h2>
            <div className="mt-5 divide-y divide-slate-200">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 py-4 first:pt-0">
                  <img
                    src={`https://images.unsplash.com/${item.image}?w=160&h=100&fit=crop&auto=format`}
                    alt=""
                    className="h-14 w-20 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-5 text-[#0b1735]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {formatNaira(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between border-t border-slate-200 pt-5 text-lg font-bold text-[#0b1735]">
              <span>Total</span>
              <span>{formatNaira(total)}</span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
