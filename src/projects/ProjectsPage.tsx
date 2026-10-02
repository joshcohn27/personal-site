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
        link: "https://casino.joshbcohn.com",
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
        type: "Interactive Web App",
        description:
            "Built a scheduling tool for Camp Seneca Lake to automate nightly on-duty staff coverage across 5 villages with 20-30 staff and uneven bunk groups, replacing a manual process that used to take hours every session. The engine runs 800 candidate schedules per generation, scores each one against fairness rules covering night-type severity, raw duty counts, and pairing diversity, and picks the best one that passes validation, with bunk-based slot restrictions and automatic fallback to floater staff when a bunk can't fill its own slot. Includes admin controls to freeze, lock out, or manually override any assignment, and I stress-tested the algorithm across dozens of synthetic rosters to make sure the fairness held up on edge cases, not just typical ones. Also built a second independent scheduling mode for Porch OD / Director-on-Duty coverage, plus print-ready Word calendar export.",
        stack: ["React", "TypeScript", "Vite", "CSS Modules", "docx"],
        link: "https://scheduler.joshbcohn.com",
        linkLabel: "Open Scheduler",
    },
    {
        title: "Autopick",
        type: "Interactive Web App",
        description:
            "A live draft assistant for my fantasy league that reads our Google Sheet and tells whoever is on the clock who to take, with reasoning and runner-ups. It shows who is on the clock, suggests the best pick for that team, and tracks trades as they happen. There is also an ADP board and a view of every team's roster, and the whole thing works without a backend.",
        stack: ["React", "TypeScript", "Vite", "Vitest", "Google Sheets API"],
        link: "https://autopick.joshbcohn.com",
        linkLabel: "Open Autopick",
    },
    {
        title: "Weekly Period Schedule Builder",
        type: "Interactive Web App",
        description:
            "A schedule builder I made for camp staff to plan a four week session of activity periods, with auto-merging, Excel import and export, and one click schedule generation. A tracking tab counts program areas per bunk, and the auto generate button builds a full week while keeping totals fair across the session. It runs entirely in the browser with no backend.",
        stack: ["React", "TypeScript", "Vite", "SheetJS"],
        link: "https://weekly.joshbcohn.com",
        linkLabel: "Open Builder",
    },
    {
        title: "Wrapped",
        type: "Interactive Web App",
        description:
            "My own Spotify Wrapped built from my full streaming history, 2016 to 2026, with a stats dashboard and search. Anyone can upload their own export and see theirs. A build script precomputes the stats so the page loads fast, and uploaded exports are processed entirely in the browser and never sent anywhere.",
        stack: ["HTML", "CSS", "JavaScript", "Node.js", "Web Workers", "IndexedDB"],
        link: "https://wrapped.joshbcohn.com",
        linkLabel: "Open Wrapped",
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