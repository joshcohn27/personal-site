import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// homepage sections the nav can highlight, in page order
const HOME_SECTIONS = ["projects", "about", "poetry", "contact"];

// nav items in display order; "section" items scroll to a homepage section
const NAV_ITEMS = [
    { key: "projects", label: "Projects", section: "projects" },
    { key: "about", label: "About", section: "about" },
    { key: "poetry", label: "Poetry", section: "poetry" },
    { key: "contact", label: "Contact", section: "contact" },
    { key: "resume", label: "Resume", href: "/resume.pdf" },
];

// matches the css breakpoint where the menu button replaces the nav links
const MOBILE_QUERY = "(max-width: 767px)";

// window height, so the observer below can be rebuilt when the window is resized
function useViewportHeight() {
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        const onResize = () => {
            setHeight(window.innerHeight);
        };
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return height;
}

// which homepage section is in view, tracked with IntersectionObserver.
// a section is "in view" when it crosses a thin line just below the sticky header.
function useHomeSection(enabled, hash) {
    const [current, setCurrent] = useState(null);
    const viewportHeight = useViewportHeight();

    useEffect(() => {
        if (!enabled) {
            setCurrent(null);
            return;
        }

        const header = document.querySelector(".site-header");
        let headerHeight = 0;
        if (header) {
            headerHeight = header.offsetHeight;
        }

        // the line sits 24px below the header and is 1px tall
        const lineTop = headerHeight + 24;
        const lineBottom = viewportHeight - lineTop - 1;

        let onLine = null;
        const onScreen = new Set();
        let footerVisible = false;

        const pick = () => {
            // the last sections are short and can't reach the line, so at the bottom of the page
            // use the section that was clicked if it's on screen, otherwise contact
            if (footerVisible) {
                const clicked = hash.slice(1);
                if (HOME_SECTIONS.includes(clicked) && onScreen.has(clicked)) {
                    setCurrent(clicked);
                } else {
                    setCurrent("contact");
                }
                return;
            }
            setCurrent(onLine);
        };

        const lineObserver = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        onLine = entry.target.id;
                    } else if (onLine === entry.target.id) {
                        onLine = null;
                    }
                }
                pick();
            },
            { rootMargin: `-${lineTop}px 0px -${lineBottom}px 0px` },
        );

        const screenObserver = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    onScreen.add(entry.target.id);
                } else {
                    onScreen.delete(entry.target.id);
                }
            }
            pick();
        });

        const footerObserver = new IntersectionObserver((entries) => {
            footerVisible = entries[0].isIntersecting;
            pick();
        });

        for (const id of HOME_SECTIONS) {
            const el = document.getElementById(id);
            if (el) {
                lineObserver.observe(el);
                screenObserver.observe(el);
            }
        }
        const footer = document.querySelector(".site-footer");
        if (footer) {
            footerObserver.observe(footer);
        }

        return () => {
            lineObserver.disconnect();
            screenObserver.disconnect();
            footerObserver.disconnect();
        };
    }, [enabled, hash, viewportHeight]);

    return current;
}

function MenuIcon({ open }) {
    if (open) {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
        );
    }
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
    );
}

function ExternalIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 4h6v6" />
            <path d="M20 4l-9 9" />
            <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
        </svg>
    );
}

export default function Header() {
    const { pathname, hash, key: locationKey } = useLocation();
    const onHome = pathname === "/";
    const homeSection = useHomeSection(onHome, hash);
    const [menuOpen, setMenuOpen] = useState(false);
    const headerRef = useRef(null);
    const toggleRef = useRef(null);

    let active = null;
    if (onHome) {
        active = homeSection;
    } else if (pathname.startsWith("/projects")) {
        active = "projects";
    } else if (pathname.startsWith("/poetry")) {
        active = "poetry";
    }

    // close the menu on any navigation, including clicking the link you're already on
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname, hash, locationKey]);

    // while open: escape closes (focus back on the button), a tap outside closes,
    // and widening past the breakpoint closes it
    useEffect(() => {
        if (!menuOpen) {
            return;
        }

        const onKey = (e) => {
            if (e.key === "Escape") {
                setMenuOpen(false);
                if (toggleRef.current) {
                    toggleRef.current.focus();
                }
            }
        };
        const onPointer = (e) => {
            if (headerRef.current && !headerRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        const media = window.matchMedia(MOBILE_QUERY);
        const onMedia = () => {
            if (!media.matches) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("keydown", onKey);
        document.addEventListener("pointerdown", onPointer);
        media.addEventListener("change", onMedia);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.removeEventListener("pointerdown", onPointer);
            media.removeEventListener("change", onMedia);
        };
    }, [menuOpen]);

    // the brand always goes to the top of the homepage, even when already there
    const goToTop = () => {
        setMenuOpen(false);
        if (onHome) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // section links: on the homepage the url may not change, so scroll directly
    const goToSection = (id) => {
        setMenuOpen(false);
        if (onHome && hash === `#${id}`) {
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    let menuLabel = "Open menu";
    if (menuOpen) {
        menuLabel = "Close menu";
    }

    // used for both the desktop nav and the mobile panel
    const renderLinks = () =>
        NAV_ITEMS.map((item) => {
            let activeProps = {};
            if (active === item.key) {
                let current = "page";
                if (onHome) {
                    current = "location";
                }
                activeProps = { className: "is-active", "aria-current": current };
            }

            if (item.href) {
                return (
                    <a
                        key={item.key}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setMenuOpen(false)}
                    >
                        <span className="nav-external">
                            {item.label}
                            <ExternalIcon />
                        </span>
                    </a>
                );
            }

            return (
                <Link
                    key={item.key}
                    to={`/#${item.section}`}
                    onClick={() => goToSection(item.section)}
                    {...activeProps}
                >
                    {item.label}
                </Link>
            );
        });

    return (
        <header className="site-header" ref={headerRef}>
            <div className="container header-inner">
                <Link to="/" className="brand" onClick={goToTop}>
                    Josh Cohn
                </Link>

                <nav className="site-nav" aria-label="Primary navigation">
                    {renderLinks()}
                </nav>

                <button
                    ref={toggleRef}
                    type="button"
                    className="menu-toggle"
                    aria-label={menuLabel}
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
