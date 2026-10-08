import { Link, Navigate, useNavigate } from "react-router";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLearning } from "../context/useLearning";
import { formatNaira } from "../lib/money";
import { ApiError, apiRequest } from "../lib/api";
import { learningApi } from "../lib/learningApi";
import { notify } from "../lib/notify";
import {
  getReferralSessionId,
  getStoredReferralCode,
} from "../lib/referralsApi";

export default function Checkout() {
  const { items, total, removeFromCart } = useCart();
  const { user } = useAuth();
  const { refresh: refreshLearning } = useLearning();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
            onSubmit={async (event) => {
              event.preventDefault();
              setLoading(true);
              setError("");
              try {
                const response = await apiRequest<{
                  data: { authorizationUrl: string };
                }>("/payments/initialize", {
                  method: "POST",
                  body: JSON.stringify({
                    courseId: items[0].backendId || items[0].id,
                    ...(getStoredReferralCode()
                      ? {
                          referralCode: getStoredReferralCode(),
                          referralSessionId: getReferralSessionId(),
                        }
                      : {}),
                    callbackUrl: `${window.location.origin}/payment/callback?courseId=${encodeURIComponent(items[0].backendId || items[0].id)}`,
                  }),
                });
                window.location.assign(response.data.authorizationUrl);
              } catch (requestError) {
                if (
                  requestError instanceof ApiError &&
                  requestError.status === 409 &&
                  requestError.code === "COURSE_INCLUDED_IN_SUBSCRIPTION"
                ) {
                  try {
                    const access = await learningApi.getAccess(
                      items[0].backendId || items[0].id,
                    );
                    if (access.data.access.granted) {
                      await removeFromCart(items[0].backendId || items[0].id);
                      await refreshLearning();
                      navigate(`/courses/${items[0].id}/lessons`);
                      return;
                    }
                  } catch {
                    // Keep the course in the cart if access cannot be confirmed.
                  }
                  setError(
                    "This course may be included in your plan, but we could not confirm access. Please refresh your subscription status or contact support.",
                  );
                } else if (
                  requestError instanceof ApiError &&
                  requestError.status === 409
                ) {
                  setError("This course is already in your learning library.");
                } else {
                  setError(
                    "We could not start checkout. Please try again shortly.",
                  );
                }
              } finally {
                setLoading(false);
              }
            }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 className="text-lg font-bold text-[#0b1735]">
              Payment via Kora
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Continue to Kora’s secure hosted checkout to enter your payment
              details. Your card information is never collected on this page.
            </p>
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full rounded-xl bg-primary-blue px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#0b1735]"
            >
              {loading
                ? "Starting secure payment..."
                : `Pay ${formatNaira(total)}`}
            </button>
          </form>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#0b1735]">Order summary</h2>
            <div className="mt-5 divide-y divide-slate-200">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 py-4 first:pt-0">
                  <img
                    src={
                      item.image.startsWith("http")
                        ? item.image
                        : `https://images.unsplash.com/${item.image}?w=160&h=100&fit=crop&auto=format`
                    }
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
