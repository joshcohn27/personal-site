export default function Hero() {
  return (
    <section id="top" className="hero-section">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Software Engineer • RIT • Product-Minded Builder</p>

          <h1>
            I build thoughtful software that is polished, useful, and designed
            to help people.
          </h1>

          <p className="hero-text">
            I’m Josh Cohn, a Computing and Information Technologies student at
            RIT with a Software Engineering minor. I care about building
            software that solves real problems, reflects strong engineering
            judgment, and creates a positive impact through sustainable and
            ethical technology.
          </p>

          <div className="hero-actions">
            <a href="#projects" className="button button-primary">
              View Projects
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="button button-secondary"
            >
              View Resume
            </a>
          </div>
        </div>

        <aside className="hero-panel">
          <div className="hero-card">
            <p className="hero-card-label">Focus Areas</p>
            <ul className="hero-list">
              <li>Full-stack web development</li>
              <li>React and modern frontend architecture</li>
              <li>Developer tools and workflow improvement</li>
              <li>Human-centered and ethical product thinking</li>
            </ul>
          </div>

          <div className="hero-card">
            <p className="hero-card-label">Currently Interested In</p>
            <p className="hero-card-text">
              Sustainable technology, accessible product design, responsible AI,
              and software that meaningfully improves people’s lives.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}