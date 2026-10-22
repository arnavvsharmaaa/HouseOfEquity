"use client";

import { useEffect, useState } from "react";

/**
 * Screen-reader-only live region that announces `message` once the visitor pauses,
 * instead of on every slider step or keystroke.
 */
export function LiveAnnouncer({ message, delay = 700 }: { message: string; delay?: number }) {
  const [spoken, setSpoken] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setSpoken(message), delay);
    return () => clearTimeout(t);
  }, [message, delay]);

  return (
    <p className="sr-only" aria-live="polite" aria-atomic="true">
      {spoken}
    </p>
  );
}
