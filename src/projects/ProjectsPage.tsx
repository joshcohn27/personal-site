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
            "Built an interactive NHL draft lottery and mock draft simulator that combines two tools fans usually have to use separately. The app models real lottery constraints, visualizes the ping-pong ball draw, and then carries the finalized draft order directly into a mock draft workflow. What started as a small Python script became a full React and TypeScript project focused on accurate rules logic, data-driven rankings, and a smooth user experience.",
        stack: ["React", "TypeScript", "CSV parsing", "game logic", "UI/UX"],
        link: "https://nhlmock.joshbcohn.com",
        linkLabel: "Open Simulator",
    },
    {
        title: "Table Game Simulator",
        type: "Interactive Web App",
        description:
            "Built a browser-based casino-style table game simulator focused on accurate game rules, clean interaction design, and complex state handling. The project includes multiple games and variants, each requiring careful logic for betting flows, hand evaluation, payouts, edge cases, and player/dealer actions. A small group of friends use it regularly, which has helped me improve the app through real feedback instead of just building in isolation.",
        stack: ["React", "TypeScript", "state management", "game logic", "UI/UX"],
        link: "https://joshbcohn.com/casino",
        linkLabel: "Open Simulator",
    },
    {
        title: "Beehive Monitoring System",
        type: "Undergrad Senior Capstone",
        description:
            "Led frontend development for a six-person senior capstone project that monitored data from a physical beehive and displayed it through a React dashboard. I established the frontend structure, built core dashboard and inspection views, and helped create patterns the rest of the team could build on. I also contributed to the Oracle database design, giving me experience working across the full stack from sensor data to backend services to user-facing visualization.",
        stack: ["React", "Node.js", "Oracle", "REST API", "frontend architecture"],
        link: "https://joshbcohn.com/projects/beehive",
        linkLabel: "View Demo",
    },
    {
        title: "Committed",
        type: "VS Code Extension",
        description:
            "Built the VS Code interface for a team project that uses a local LLM to review uncommitted code changes and generate commit messages for developer approval. I owned the sidebar UI and extension integration work, connecting the user-facing VS Code experience with Git data and local model output. The project gave me hands-on experience designing AI-assisted developer tooling that keeps the human in control.",
        stack: ["VS Code Extension API", "Node.js", "Ollama", "Git", "JavaScript"],
    },
    {
        title: "OD Scheduler",
        type: "Python Utility",
        description:
            "Created a Python scheduling tool for my summer camp unit of 25 to 30 staff members to replace a manual, time-consuming on-duty scheduling process. The script helped balance assignments more fairly and reduced hours of planning work. After using it myself, I shared it with two other unit leaders who adopted it for their own schedules.",
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
                            <h2>Projects.</h2>
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
                                onClick={() => window.scrollTo(0, 0)}
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