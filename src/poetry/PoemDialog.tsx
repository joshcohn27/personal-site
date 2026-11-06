import { useState, useEffect, useCallback, useRef } from "react";
import IconButton from "../components/ui/IconButton";

// what the open poem card needs; a full Poem from parsePoem fits
interface DialogPoem {
    title: string;
    body: string;
    slug: string;
    dedication?: string;
}

interface PoemDialogProps {
    poem: DialogPoem;
    onClose: () => void;
}

// the open poem card, used on the Poetry page and the homepage.
// share and close buttons, escape closes it, tab stays inside it,
// and focus goes back to whatever opened it.
export default function PoemDialog({ poem, onClose }: PoemDialogProps) {
    const [copied, setCopied] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    const handleShare = useCallback(async () => {
        const url = `${window.location.origin}/poetry?poem=${poem.slug}`;

        // phones (and some desktops) have a native share sheet
        if (typeof navigator.share === "function") {
            try {
                await navigator.share({ url, title: poem.title });
            } catch {
                // the visitor closed the share sheet
            }
            return;
        }

        // everywhere else, copy the link and say so for about 2 seconds
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [poem]);

    // escape closes it, and tab stays inside it
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
                return;
            }
            if (e.key !== "Tab" || !panelRef.current) {
                return;
            }
            const focusable = panelRef.current.querySelectorAll<HTMLElement>("button, a[href]");
            if (focusable.length === 0) {
                return;
            }
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const inside = panelRef.current.contains(document.activeElement);
            if (e.shiftKey && (document.activeElement === first || !inside)) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
                e.preventDefault();
                first.focus();
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => {
            window.removeEventListener("keydown", handleKey);
        };
    }, [onClose]);

    // move focus into the poem, stop the page behind it from scrolling,
    // and on close put focus back on whatever opened the poem
    useEffect(() => {
        const opener = document.activeElement as HTMLElement | null;
        document.body.style.overflow = "hidden";
        if (panelRef.current) {
            panelRef.current.focus();
        }
        return () => {
            document.body.style.overflow = "";
            if (opener && opener !== document.body) {
                opener.focus();
            }
        };
    }, []);

    return (
        <div className="poem-overlay" onClick={onClose}>
            <div
                ref={panelRef}
                className="poem-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="poem-dialog-title"
                tabIndex={-1}
                onClick={e => e.stopPropagation()}
            >
                {/* pinned to the card's top-right corner */}
                <div className="poem-actions">
                    <IconButton label="Share poem" onClick={handleShare}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
                            <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
                        </svg>
                    </IconButton>
                    <IconButton label="Close poem" onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                            <line x1="6" y1="6" x2="18" y2="18" />
                            <line x1="18" y1="6" x2="6" y2="18" />
                        </svg>
                    </IconButton>
                    {/* announced to screen readers when the link is copied */}
                    <span className="poem-copied" role="status">
                        {copied && "Link copied"}
                    </span>
                </div>

                <h2 id="poem-dialog-title" className="poem-heading">{poem.title}</h2>

                {poem.dedication && (
                    <p className="poem-dedication">{poem.dedication}</p>
                )}

                <pre className="poem-body">{poem.body}</pre>
            </div>
        </div>
    );
}
