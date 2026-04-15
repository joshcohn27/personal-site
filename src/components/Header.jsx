export default function Header() {
    return (
        <header className="site-header">
            <div className="container header-inner">
                <a href="#top" className="brand">
                    Josh Cohn
                </a>

                <nav className="site-nav" aria-label="Primary navigation">
                    <div className="nav-dropdown">
                        <button
                            type="button"
                            className="nav-dropdown-trigger"
                            aria-haspopup="true"
                        >
                            Projects
                        </button>

                        <div className="nav-dropdown-menu">
                            <a href="/#projects">All Projects</a>
                            <a href="/projects/beehive">Beehive Monitoring System</a>
                            <a href="/casino">Personal Casino</a>
                        </div>
                    </div>

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