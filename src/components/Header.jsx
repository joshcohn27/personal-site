import { useEffect, useState } from "react";
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

export default function Header() {
    const { pathname, hash } = useLocation();
    const onHome = pathname === "/";
    const homeSection = useHomeSection(onHome);

    let active = null;
    if (onHome) active = homeSection;
    else if (pathname.startsWith("/projects")) active = "projects";
    else if (pathname.startsWith("/poetry")) active = "poetry";

    // aria-current: "page" for a separate page, "location" for a homepage section.
    const navProps = (key) =>
        active === key
            ? { className: "is-active", "aria-current": onHome ? "location" : "page" }
            : {};

    // Clicking the section you're already on doesn't change the URL, so scroll to it directly.
    const sectionLink = (id) => ({
        to: `/#${id}`,
        onClick: () => {
            if (onHome && hash === `#${id}`) {
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
            }
        },
    });

    return (
        <header className="site-header">
            <div className="container header-inner">
                <Link to="/" className="brand">
                    Josh Cohn
                </Link>

                <nav className="site-nav" aria-label="Primary navigation">
                    <Link to="/projects" {...navProps("projects")}>
                        Projects
                    </Link>

                    <Link {...sectionLink("about")} {...navProps("about")}>About</Link>
                    <Link {...sectionLink("future")} {...navProps("goals")}>Goals</Link>
                    <Link {...sectionLink("interests")} {...navProps("interests")}>Outside of Work</Link>
                    <Link to="/poetry" {...navProps("poetry")}>Poetry</Link>
                    <Link {...sectionLink("contact")} {...navProps("contact")}>Contact</Link>
                </nav>
            </div>
        </header>
    );
}
