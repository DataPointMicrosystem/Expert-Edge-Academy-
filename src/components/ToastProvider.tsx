import { useEffect, useState, type ReactNode } from "react";
import type { NoticeDetail } from "../lib/notify";

interface Toast extends NoticeDetail {
  id: number;
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleNotice = (event: Event) => {
      const detail = (event as CustomEvent<NoticeDetail>).detail;
      const id = Date.now() + Math.random();
      setToasts((current) => [...current, { ...detail, id }].slice(-4));
      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, 4500);
    };
    window.addEventListener("expertedge:notice", handleNotice);
    return () => window.removeEventListener("expertedge:notice", handleNotice);
  }, []);

  return (
    <>
      {children}
      <div
        className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-[0_18px_45px_rgba(11,23,53,0.18)] ${
              toast.type === "error"
                ? "border-red-200"
                : toast.type === "success"
                  ? "border-emerald-200"
                  : "border-blue-200"
            }`}
          >
            <span
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black text-white ${toast.type === "error" ? "bg-red-500" : toast.type === "success" ? "bg-emerald-500" : "bg-primary-blue"}`}
            >
              {toast.type === "error"
                ? "!"
                : toast.type === "success"
                  ? "✓"
                  : "i"}
            </span>
            <p className="flex-1 text-sm font-semibold leading-5 text-[#17213D]">
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() =>
                setToasts((current) =>
                  current.filter((item) => item.id !== toast.id),
                )
              }
              className="text-lg leading-none text-slate-400 hover:text-slate-700"
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
