import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="site-header">
            <div className="container header-inner">
                <Link to="/" className="brand">
                    Josh Cohn
                </Link>

                <nav className="site-nav" aria-label="Primary navigation">
                    <Link to="/projects" onClick={() => window.scrollTo(0, 0)}>
                        Projects
                    </Link>

                    <a href="/#about">About</a>
                    <a href="/#future">Goals</a>
                    <a href="/#interests">Outside of Work</a>
                    <a href="/#contact">Contact</a>
                    <a href="/poetry">Poetry</a>
                </nav>
            </div>
        </header>
    );
}