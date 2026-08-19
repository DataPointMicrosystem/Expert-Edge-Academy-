import { useState } from "react";
import { Link } from "react-router";

export default function TeachDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <Link
        to="/teach"
        className="text-sm font-medium px-3 py-2 rounded-lg text-neutral-700 hover:text-primary-blue hover:bg-neutral-100 transition-colors"
        aria-haspopup="true"
        aria-expanded={open}
      >
        Teach on ExpertEdge
      </Link>

      <div
        className={`absolute right-0 top-full z-50 w-[290px] pt-3 transition-all duration-200 ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <div className="rounded-xl border border-neutral-300 bg-white px-4 py-5 text-center shadow-lg shadow-neutral-900/10">
          <h2 className="font-display text-[1rem] font-bold leading-tight text-charcoal">
            Share your expertise.
          </h2>
          <p className="mt-1 font-display text-[1rem] font-bold leading-tight text-charcoal">
            Inspire the next generation of learners.
          </p>
          <Link
            to="/teach"
            className="mt-4 block rounded-lg bg-primary-blue px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-deep-blue"
            onClick={() => setOpen(false)}
          >
            Learn more
          </Link>
        </div>
      </div>
    </div>
  );
}
