import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { apiRequest } from "../lib/api";
import { notify } from "../lib/notify";

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const reference =
      searchParams.get("reference") || searchParams.get("trxref");
    if (!reference) {
      setMessage("No payment reference was provided.");
      notify("No payment reference was provided.", "error");
      return;
    }
    const courseId = searchParams.get("courseId");
    apiRequest(`/payments/verify/${encodeURIComponent(reference)}`, {
      method: "POST",
    })
      .then(async () => {
        if (courseId) {
          await apiRequest(`/cart/remove/${encodeURIComponent(courseId)}`, {
            method: "DELETE",
          });
        }
        const cart = await apiRequest<{ data: any[] | { items?: any[] } }>(
          "/cart",
        );
        const remaining = Array.isArray(cart.data)
          ? cart.data
          : cart.data.items || [];
        const nextCourse = remaining[0]?.course || remaining[0];
        const nextCourseId =
          nextCourse?._id || nextCourse?.id || nextCourse?.slug;
        if (nextCourseId) {
          const nextPayment = await apiRequest<{
            data: { authorizationUrl: string };
          }>("/payments/initialize", {
            method: "POST",
            body: JSON.stringify({
              courseId: nextCourseId,
              callbackUrl: `${window.location.origin}/payment/callback?courseId=${encodeURIComponent(nextCourseId)}`,
            }),
          });
          window.location.assign(nextPayment.data.authorizationUrl);
          return;
        }
        setMessage("Payment verified. Your courses are ready.");
        notify("Payment verified. Your courses are ready.", "success");
      })
      .catch((error) => {
        const message =
          error instanceof Error
            ? error.message
            : "Payment verification failed.";
        setMessage(message);
        notify(message, "error");
      });
  }, [searchParams]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <section className="max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-[#0b1735]">Payment status</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex rounded-xl bg-primary-blue px-5 py-3 text-sm font-semibold text-white"
        >
          Go to dashboard
        </Link>
      </section>
    </main>
  );
}
