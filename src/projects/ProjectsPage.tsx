import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Project {
    title: string;
    type: string;
    description: string;
    stack: string[];
    link?: string;
    linkLabel?: string;
    repo?: string;
}

const projects: Project[] = [
    {
        title: "NHL Draft Lottery Simulator",
        type: "Interactive Web App",
        description:
            "Built solo over two months, evolving from a Python script into a full React/TypeScript web app. The only online tool combining animated ping-pong ball lottery draws with a complete round-one mock draft simulator. Draw balls one at a time, simulate the full draw, or load the real 2026 results, then move into a mock draft with a live prospect board, position filters, and a printable draft sheet.",
        stack: ["React", "TypeScript", "CSV parsing", "game logic", "UI/UX"],
        link: "https://nhlmock.joshbcohn.com",
        linkLabel: "Open Simulator",
    },
    {
        title: "Personal Casino",
        type: "Interactive Web App",
        description:
            "A browser-based recreation of real table games built so my friends and I could enjoy the strategy and mechanics of casino games without real money on the line. The focus was accurate game logic, smooth state management, and a UI that actually feels like a real product. Has 10+ active players.",
        stack: ["React", "TypeScript", "state management", "game logic", "UI/UX"],
        link: "https://joshbcohn.com/casino",
        linkLabel: "Play Casino",
    },
    {
        title: "Beehive Monitoring System",
        type: "Undergrad Senior Capstone",
        description:
            "A full-stack senior capstone tracking live hive conditions from a sensor inside the beehive, transmitting wirelessly to a campus receiver, through a Node/Oracle backend, to a React dashboard. I led frontend architecture and helped with database design, establishing component structure and standards the team built on throughout the project.",
        stack: ["React", "Node.js", "Oracle", "REST API", "frontend architecture"],
        link: "https://joshbcohn.com/projects/beehive",
        linkLabel: "View Demo",
    },
    {
        title: "Committed",
        type: "VS Code Extension",
        description:
            "A VS Code extension that uses a local LLM (Ollama) to analyze your working diff, classify changes as a feature, bug fix, or refactor, filter relevant code hunks, and generate a commit message for your review before pushing. Built with a team of five in an Agile environment. I owned the sidebar UI and VS Code interface layer.",
        stack: ["VS Code Extension API", "Node.js", "Ollama", "Git", "JavaScript"],
    },
    {
        title: "OD Scheduler",
        type: "Python Utility",
        description:
            "A Python scheduling tool built to automate on-duty day assignments for my camp unit of 25 to 30 staff, then shared with two other unit leaders who used it successfully. Turning fairness constraints like avoiding back-to-backs and balancing distribution into reliable logic was the core challenge. What previously took hours of manual work ran in under a minute.",
        stack: ["Python", "algorithms", "scripting"],
    },
];

export default function ProjectsPage() {
    return (
        <div className="site-shell">
            <Header />
            <main>
                <section className="section" style={{ paddingTop: "3.5rem" }}>
                    <div className="container">
                        <div className="section-heading" style={{ marginBottom: "2rem" }}>
                            <p className="section-label">Projects</p>
                            <h2>Things I've built.</h2>
                            <p style={{ color: "var(--muted)", marginTop: "0.6rem", maxWidth: "52ch", fontSize: "1.05rem" }}>
                                A mix of work projects, personal tools, and things I built because no one else had.
                            </p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                            {projects.map((project, i) => (
                                <article
                                    key={project.title}
                                    className="project-card"
                                    style={{
                                        padding: "1.75rem",
                                        display: "grid",
                                        gridTemplateColumns: "1fr auto",
                                        gap: "1.5rem",
                                        alignItems: "start",
                                        animationDelay: `${i * 60}ms`,
                                    }}
                                >
                                    <div>
                                        <p className="project-type">{project.type}</p>
                                        <h3 style={{ marginTop: "0.4rem", fontSize: "1.3rem" }}>
                                            {project.title}
                                        </h3>
                                        <p className="project-description" style={{ marginTop: "0.75rem", maxWidth: "72ch" }}>
                                            {project.description}
                                        </p>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginTop: "1rem" }}>
                                            {project.stack.map((tag) => (
                                                <span
                                                    key={tag}
                                                    style={{
                                                        padding: "0.3rem 0.7rem",
                                                        borderRadius: "999px",
                                                        border: "1px solid var(--line)",
                                                        color: "var(--muted)",
                                                        fontSize: "0.82rem",
                                                        fontWeight: 600,
                                                        background: "rgba(255,255,255,0.02)",
                                                    }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {project.link && (
                                        <div style={{ flexShrink: 0, paddingTop: "0.25rem" }}>
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="project-link"
                                                style={{ whiteSpace: "nowrap" }}
                                            >
                                                {project.linkLabel}
                                            </a>
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>

                        <div style={{ marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--line)" }}>
                            <Link
                                to="/"
                                style={{
                                    color: "var(--muted)",
                                    fontWeight: 600,
                                    fontSize: "0.95rem",
                                    transition: "color 0.18s ease",
                                }}
                                onMouseEnter={e => (e.currentTarget.style.color = "var(--heading)")}
                                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
                            >
                                ← Back to home
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}