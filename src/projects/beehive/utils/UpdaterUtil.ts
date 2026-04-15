import { useEffect, useRef } from "react";

type PollOptions = {
  intervalMs: number;
  enabled?: boolean;
    immediate?: boolean;
};

export function useUpdatePolling(fn: () => Promise<void>, { intervalMs, enabled = true, immediate = true }: PollOptions) {
    const timeoutRef = useRef<number | null>(null);
    const abortedRef = useRef(false);
    const fnRef = useRef(fn);

    useEffect(() => {
        fnRef.current = fn;
    }, [fn]);

    useEffect(() => {
    if (!enabled) return;

    abortedRef.current = false;

    const tick = async () => {
            if (abortedRef.current) return;

            // optional: skip if tab hidden
            if (document.visibilityState === "hidden") {
        timeoutRef.current = window.setTimeout(tick, intervalMs);
        return;
            }

            try {
                await fnRef.current();
                timeoutRef.current = window.setTimeout(tick, intervalMs);
            } catch {
                // basic backoff on error
                timeoutRef.current = window.setTimeout(tick, Math.min(intervalMs * 2, 60_000));
            }
    };

    if (immediate) {
        tick();
    } else {
        timeoutRef.current = window.setTimeout(tick, intervalMs);
    }

    return () => {
        abortedRef.current = true;
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
    }, [intervalMs, enabled, immediate]);
}
