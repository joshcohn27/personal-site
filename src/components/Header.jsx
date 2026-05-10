import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="site-header">
            <div className="container header-inner">
                <Link to="/" className="brand">
                    Josh Cohn
                </Link>

                <nav className="site-nav" aria-label="Primary navigation">
                    <Link to="/projects" onClick={() => window.scrollTo(0, 0)} style={{ color: "var(--muted)", fontWeight: 500, transition: "color 0.18s ease" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "var(--heading)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
                    >
                        Projects
                    </Link>

                    <a href="/#about">About</a>
                    <a href="/#future">My Future</a>
                    <a href="/#interests">Beyond Tech</a>
                    <a href="/#contact">Contact</a>
                    <a href="/poetry">Poetry</a>
                    <a
                        href="https://github.com/joshcohn27"
                        target="_blank"
                        rel="noreferrer"
                        className="nav-button"
                    >
                        GitHub
                    </a>
                </nav>
            </div>
        </header>
    );
}