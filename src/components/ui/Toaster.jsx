"use client";

import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "@/components/ui/icons";
import { useToastStore } from "@/lib/toast-store";

const VISIBLE_MS = 4000;
const EXIT_MS = 200;

function Toast({ id, message }) {
  const dismiss = useToastStore((s) => s.dismiss);
  const [open, setOpen] = useState(false);
  const elRef = useRef(null);
  const exitTimer = useRef(null);

  // The save toast fires while the product drawer — a modal <dialog> — is
  // still open. A normally-stacked element would render behind it, so the
  // toast is promoted into the top layer too. Manual popover: it must not be
  // light-dismissed, and it must never take focus.
  useEffect(() => {
    const el = elRef.current;
    if (el && !el.matches(":popover-open")) el.showPopover();
    const raf = requestAnimationFrame(() => setOpen(true));
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(exitTimer.current);
    };
  }, []);

  useEffect(() => {
    let remaining = VISIBLE_MS;
    let startedAt = Date.now();
    let timer = null;

    function beginExit() {
      setOpen(false);
      exitTimer.current = setTimeout(() => dismiss(id), EXIT_MS);
    }
    function start() {
      startedAt = Date.now();
      timer = setTimeout(beginExit, remaining);
    }
    function pause() {
      clearTimeout(timer);
      remaining -= Date.now() - startedAt;
    }
    // Don't burn the toast's lifetime while nobody is looking at the tab.
    function onVisibility() {
      if (document.hidden) pause();
      else start();
    }

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [id, dismiss]);

  function handleDismiss() {
    setOpen(false);
    exitTimer.current = setTimeout(() => dismiss(id), EXIT_MS);
  }

  return (
    <div
      ref={elRef}
      popover="manual"
      role="status"
      aria-live="polite"
      data-state={open ? "open" : "closed"}
      className={[
        // Reset the UA popover defaults, then place it in the content area:
        // clear of the 260px admin sidebar on the left, and clear of the
        // 520px product drawer on the right — which is open when this fires,
        // and whose Save button sits bottom-right.
        "dl-motion fixed inset-auto bottom-4 left-[calc(260px+1rem)] m-0 w-auto max-w-[min(24rem,calc(100vw-260px-2rem))]",
        "flex items-center gap-3 border border-dl-rule bg-dl-chalk px-4 py-3 shadow-dl-overlay",
        "font-dl-sans text-dl-body text-dl-ink",
        // Enters from below and leaves the same way — one direction, so the
        // motion reads as a single object arriving and departing.
        // Tailwind v4 emits translate-y-* via the CSS `translate` property,
        // not `transform` — transitioning `transform` here animates nothing.
        "translate-y-[120%] opacity-0 duration-200",
        "data-[state=open]:translate-y-0 data-[state=open]:opacity-100 data-[state=open]:duration-[320ms]",
        "transition-[translate,opacity] ease-[cubic-bezier(0.23,1,0.32,1)]",
      ].join(" ")}
    >
      <span className="flex-1">{message}</span>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss notification"
        className="shrink-0 text-dl-charcoal transition-colors hover:text-dl-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-dl-signal focus-visible:outline-offset-2"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  return toasts.map((t) => (
    <Toast key={t.id} id={t.id} message={t.message} />
  ));
}
