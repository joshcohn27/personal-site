export default function Header() {
  return (
    <header className="header">
      <h1 className="logo">Josh Cohn</h1>
      <nav className="nav">
        <a href="#about">About</a>
        <a
          href="https://github.com/joshcohn27"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>

        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}
