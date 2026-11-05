import Header from "../components/Header";
import Footer from "../components/Footer";
import ButtonLink from "../components/ui/ButtonLink";
import TextLink from "../components/ui/TextLink";
import TechChips from "../components/ui/TechChips";

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
        title: "Beehive Monitoring System",
        type: "Undergrad Senior Capstone",
        description:
            "Led frontend development for a six-person senior capstone project that monitored data from a physical beehive and displayed it through a React dashboard. I established the frontend structure, built core dashboard and inspection views, and helped create patterns the rest of the team could build on. I also contributed to the Oracle database design, giving me experience working across the full stack from sensor data to backend services to user-facing visualization.",
        stack: ["React", "Node.js", "Oracle", "REST API", "frontend architecture"],
        link: "https://joshbcohn.com/projects/beehive",
        linkLabel: "View Demo",
        repo: "https://github.com/joshcohn27/beehive-frontend",
    },
    {
        title: "NHL Draft Lottery Simulator",
        type: "Interactive Web App",
        description:
            "Built an interactive NHL draft lottery and mock draft simulator that combines two tools fans usually have to use separately. The app models real lottery constraints, visualizes the ping-pong ball draw, and then carries the finalized draft order directly into a mock draft workflow. What started as a small Python script became a full React and TypeScript project focused on accurate rules logic, data-driven rankings, and a smooth user experience.",
        stack: ["React", "TypeScript", "CSV parsing", "game logic", "UI/UX"],
        link: "https://hockeylotto.com",
        linkLabel: "Open Simulator",
        repo: "https://github.com/joshcohn27/nhl-lottery-sim",
    },
    {
        title: "OD Scheduler",
        type: "Interactive Web App",
        description:
            "Built a scheduling tool for Camp Seneca Lake to automate nightly on-duty staff coverage across 5 villages with 20-30 staff and uneven bunk groups, replacing a manual process that used to take hours every session. The engine runs 800 candidate schedules per generation, scores each one against fairness rules covering night-type severity, raw duty counts, and pairing diversity, and picks the best one that passes validation, with bunk-based slot restrictions and automatic fallback to floater staff when a bunk can't fill its own slot. Includes admin controls to freeze, lock out, or manually override any assignment, and I stress-tested the algorithm across dozens of synthetic rosters to make sure the fairness held up on edge cases, not just typical ones. Also built a second independent scheduling mode for Porch OD / Director-on-Duty coverage, plus print-ready Word calendar export.",
        stack: ["React", "TypeScript", "Vite", "CSS Modules", "docx"],
        link: "https://scheduler.joshbcohn.com",
        linkLabel: "Open Scheduler",
        repo: "https://github.com/joshcohn27/od_new",
    },
    {
        title: "Committed",
        type: "VS Code Extension",
        description:
            "Built the VS Code interface for a team project that uses a local LLM to review uncommitted code changes and generate commit messages for developer approval. I owned the sidebar UI and extension integration work, connecting the user-facing VS Code experience with Git data and local model output. The project gave me hands-on experience designing AI-assisted developer tooling that keeps the human in control.",
        stack: ["VS Code Extension API", "Node.js", "Ollama", "Git", "JavaScript"],
    },
    {
        title: "Autopick",
        type: "Interactive Web App",
        description:
            "A live draft assistant for my fantasy league that reads our Google Sheet and tells whoever is on the clock who to take, with reasoning and runner-ups. It shows who is on the clock, suggests the best pick for that team, and tracks trades as they happen. There is also an ADP board and a view of every team's roster, and the whole thing works without a backend.",
        stack: ["React", "TypeScript", "Vite", "Vitest", "Google Sheets API"],
        link: "https://autopick.joshbcohn.com",
        linkLabel: "Open Autopick",
        repo: "https://github.com/joshcohn27/autopick-react",
    },
    {
        title: "Wrapped",
        type: "Interactive Web App",
        description:
            "My own Spotify Wrapped built from my full streaming history, 2016 to 2026, with a stats dashboard and search. Anyone can upload their own export and see theirs. A build script precomputes the stats so the page loads fast, and uploaded exports are processed entirely in the browser and never sent anywhere.",
        stack: ["HTML", "CSS", "JavaScript", "Node.js", "Web Workers", "IndexedDB"],
        link: "https://wrapped.joshbcohn.com",
        linkLabel: "Open Wrapped",
        repo: "https://github.com/joshcohn27/wrapped",
    },
    {
        title: "Table Game Simulator",
        type: "Interactive Web App",
        description:
            "Built a browser-based casino-style table game simulator focused on accurate game rules, clean interaction design, and complex state handling. The project includes multiple games and variants, each requiring careful logic for betting flows, hand evaluation, payouts, edge cases, and player/dealer actions. A small group of friends use it regularly, which has helped me improve the app through real feedback instead of just building in isolation.",
        stack: ["React", "TypeScript", "state management", "game logic", "UI/UX"],
        link: "https://casino.joshbcohn.com",
        linkLabel: "Open Simulator",
        repo: "https://github.com/joshcohn27/casino",
    },
    {
        title: "Weekly Period Schedule Builder",
        type: "Interactive Web App",
        description:
            "A schedule builder I made for camp staff to plan a four week session of activity periods, with auto-merging, Excel import and export, and one click schedule generation. A tracking tab counts program areas per bunk, and the auto generate button builds a full week while keeping totals fair across the session. It runs entirely in the browser with no backend.",
        stack: ["React", "TypeScript", "Vite", "SheetJS"],
        link: "https://weekly.joshbcohn.com",
        linkLabel: "Open Builder",
        repo: "https://github.com/joshcohn27/weekly-schedule",
    },
    {
        title: "Flight Overhead",
        type: "Interactive Web App",
        description:
            "Flight Overhead tells you which plane is flying closest to you right now. It shows the airline, the route, the aircraft type, and where to look in the sky. It's like FlightAware or Flightradar24, but it only shows the one plane over your head. It runs as a web app on my phone using live public flight data.",
        stack: ["React", "TypeScript", "Vite", "Vercel serverless functions"],
        link: "https://flight.joshbcohn.com",
        linkLabel: "Open Tracker",
        repo: "https://github.com/joshcohn27/flight-app",
    },
];

export default function ProjectsPage() {
    return (
        <div className="site-shell">
            <Header />
            <main>
                <section className="section" style={{ paddingTop: "3.5rem" }}>
                    <div className="container">
                        <div className="section-heading" style={{ marginBottom: "var(--space-5)" }}>
                            <h2>Projects</h2>
                            <p className="page-intro">
                                A mix of work projects, personal tools, and things I built because no one else had.
                            </p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                            {projects.map((project) => (
                                <article key={project.title} className="project-card">
                                    <p className="project-type">{project.type}</p>
                                    <h3>{project.title}</h3>
                                    <p className="project-description">
                                        {project.description}
                                    </p>
                                    <TechChips items={project.stack} />
                                    {(project.link || project.repo) && (
                                        <div className="project-links">
                                            {project.link && (
                                                <TextLink href={project.link} newTab strong>
                                                    {project.linkLabel}
                                                </TextLink>
                                            )}
                                            {project.repo && (
                                                <TextLink href={project.repo} newTab strong>
                                                    GitHub
                                                </TextLink>
                                            )}
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>

                        <div style={{ marginTop: "var(--space-5)", paddingTop: "var(--space-4)", borderTop: "1px solid var(--color-border)" }}>
                            <ButtonLink to="/" variant="secondary">
                                Back to home
                            </ButtonLink>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}