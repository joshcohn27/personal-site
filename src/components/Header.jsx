import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Homepage sections, top to bottom, and the nav item each one highlights.
// The hero ("top") highlights nothing.
const HOME_SECTIONS = [
    ["projects", "projects"],
    ["about", "about"],
    ["future", "goals"],
    ["interests", "interests"],
    ["contact", "contact"],
];

// Nav items in display order. `section` items are homepage anchors; `to` items are pages.
const NAV_ITEMS = [
    { key: "projects", label: "Projects", to: "/projects" },
    { key: "about", label: "About", section: "about" },
    { key: "goals", label: "Goals", section: "future" },
    { key: "interests", label: "Outside of Work", section: "interests" },
    { key: "poetry", label: "Poetry", to: "/poetry" },
    { key: "contact", label: "Contact", section: "contact" },
];

// Matches the CSS breakpoint where the menu button replaces the nav links.
const MOBILE_QUERY = "(max-width: 767px)";

// Which homepage section is under the sticky header right now.
function useHomeSection(enabled) {
    const [current, setCurrent] = useState(null);

    useEffect(() => {
        if (!enabled) {
            setCurrent(null);
            return;
        }

        const update = () => {
            const headerHeight = document.querySelector(".site-header")?.offsetHeight ?? 0;
            const line = headerHeight + 24;
            const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

            let found = null;
            for (const [id, key] of HOME_SECTIONS) {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= line) found = key;
            }
            // The last section is short, so treat reaching the bottom as being on it.
            if (atBottom) found = HOME_SECTIONS[HOME_SECTIONS.length - 1][1];
            setCurrent(found);
        };

        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, [enabled]);

    return current;
}

function MenuIcon({ open }) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? (
                <>
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                </>
            ) : (
                <>
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                </>
            )}
        </svg>
    );
}

export default function Header() {
    const { pathname, hash, key: locationKey } = useLocation();
    const onHome = pathname === "/";
    const homeSection = useHomeSection(onHome);
    const [menuOpen, setMenuOpen] = useState(false);
    const headerRef = useRef(null);
    const toggleRef = useRef(null);

    let active = null;
    if (onHome) active = homeSection;
    else if (pathname.startsWith("/projects")) active = "projects";
    else if (pathname.startsWith("/poetry")) active = "poetry";

    // Close the menu on any navigation, including clicking the link you're already on.
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname, hash, locationKey]);

    // While open: Escape closes (and returns focus to the button), a tap outside the header closes,
    // and widening past the breakpoint closes it so it isn't left open behind the desktop nav.
    useEffect(() => {
        if (!menuOpen) return;

        const onKey = (e) => {
            if (e.key === "Escape") {
                setMenuOpen(false);
                toggleRef.current?.focus();
            }
        };
        const onPointer = (e) => {
            if (headerRef.current && !headerRef.current.contains(e.target)) setMenuOpen(false);
        };
        const media = window.matchMedia(MOBILE_QUERY);
        const onMedia = () => { if (!media.matches) setMenuOpen(false); };

        document.addEventListener("keydown", onKey);
        document.addEventListener("pointerdown", onPointer);
        media.addEventListener("change", onMedia);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.removeEventListener("pointerdown", onPointer);
            media.removeEventListener("change", onMedia);
        };
    }, [menuOpen]);

    // Renders the nav links; used for both the desktop nav and the mobile panel.
    const renderLinks = () =>
        NAV_ITEMS.map((item) => {
            const isActive = active === item.key;
            const activeProps = isActive
                ? { className: "is-active", "aria-current": onHome ? "location" : "page" }
                : {};

            if (item.section) {
                return (
                    <Link
                        key={item.key}
                        to={`/#${item.section}`}
                        // Clicking the section you're already on doesn't change the URL, so scroll to it directly.
                        onClick={() => {
                            setMenuOpen(false);
                            if (onHome && hash === `#${item.section}`) {
                                document.getElementById(item.section)?.scrollIntoView({ behavior: "smooth" });
                            }
                        }}
                        {...activeProps}
                    >
                        {item.label}
                    </Link>
                );
            }
            return (
                <Link key={item.key} to={item.to} onClick={() => setMenuOpen(false)} {...activeProps}>
                    {item.label}
                </Link>
            );
        });

    return (
        <header className="site-header" ref={headerRef}>
            <div className="container header-inner">
                <Link to="/" className="brand">
                    Josh Cohn
                </Link>

                <nav className="site-nav" aria-label="Primary navigation">
                    {renderLinks()}
                </nav>

                <button
                    ref={toggleRef}
                    type="button"
                    className="menu-toggle"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-menu"
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    <MenuIcon open={menuOpen} />
                </button>
            </div>

            <nav id="mobile-menu" className="mobile-menu" aria-label="Primary navigation" hidden={!menuOpen}>
                {renderLinks()}
            </nav>
        </header>
    );
}
