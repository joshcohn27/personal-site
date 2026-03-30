export default function Header() {
    return (
        <header className="site-header">
            <div className="container header-inner">
                <a href="#top" className="brand">
                    Josh Cohn
                </a>

                <nav className="site-nav" aria-label="Primary navigation">
                    <a href="#projects">Projects</a>
                    <a href="#about">About</a>
                    <a href="#future">My Future</a>
                    <a href="#interests">Beyond Tech</a>
                    <a href="#contact">Contact</a>
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