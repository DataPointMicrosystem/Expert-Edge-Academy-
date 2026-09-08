import { Link, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatNaira } from "../lib/money";

export default function Cart() {
  const { items, total, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const proceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirectTo=${encodeURIComponent("/checkout")}`);
      return;
    }
    navigate("/checkout");
  };

  return (
    <main className="min-h-[70vh] bg-slate-50 px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary-blue">
            Your learning plan
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[#0b1735] sm:text-4xl">
            Shopping cart
          </h1>
        </div>

        {items.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-primary-blue">
              <svg
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path
                  d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 6h18M16 10a4 4 0 01-8 0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#0b1735]">
              Your cart is empty
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              Find a course that fits your goals and start building your next
              skill.
            </p>
            <Link
              to="/"
              className="mt-7 inline-flex rounded-xl bg-primary-blue px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b1735]"
            >
              Explore courses
            </Link>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
                <h2 className="font-bold text-[#0b1735]">
                  {items.length} {items.length === 1 ? "course" : "courses"}
                </h2>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-sm font-medium text-slate-500 transition hover:text-red-600"
                >
                  Clear cart
                </button>
              </div>
              <div className="divide-y divide-slate-200">
                {items.map((item) => (
                  <article key={item.id} className="flex gap-4 p-5 sm:p-6">
                    <img
                      src={`https://images.unsplash.com/${item.image}?w=480&h=270&fit=crop&auto=format`}
                      alt={item.title}
                      className="h-20 w-28 shrink-0 rounded-lg object-cover sm:h-24 sm:w-36"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold leading-5 text-[#0b1735]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.instructor}
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-sm font-medium text-slate-500 transition hover:text-red-600"
                        >
                          Remove
                        </button>
                        <strong className="text-base text-primary-blue">
                          {formatNaira(item.price)}
                        </strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#0b1735]">
                Order summary
              </h2>
              <div className="mt-6 flex items-center justify-between border-b border-slate-200 pb-4 text-sm text-slate-600">
                <span>Subtotal</span>
                <span>{formatNaira(total)}</span>
              </div>
              <div className="flex items-center justify-between py-5 text-lg font-bold text-[#0b1735]">
                <span>Total</span>
                <span>{formatNaira(total)}</span>
              </div>
              <button
                type="button"
                onClick={proceedToCheckout}
                className="w-full rounded-xl bg-primary-blue px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#0b1735]"
              >
                Proceed to checkout
              </button>
              <Link
                to="/"
                className="mt-4 block text-center text-sm font-semibold text-primary-blue hover:underline"
              >
                Continue exploring
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
