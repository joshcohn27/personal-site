import { Link } from "react-router-dom";

const featured = [
    {
        title: "NHL Draft Lottery Simulator",
        type: "Interactive Web App",
        link: "https://nhlmock.joshbcohn.com",
        linkLabel: "Open Simulator",
    },
    {
        title: "Beehive Monitoring System",
        type: "Undergrad Senior Capstone",
        link: "https://joshbcohn.com/projects/beehive",
        linkLabel: "View Demo",
    },
];

export default function Projects() {
    return (
        <section id="projects" className="section section-alt">
            <div className="container">
                <div className="section-heading" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                        <p className="section-label">Projects</p>
                        <h2>Selected work.</h2>
                    </div>
                    <Link
                        to="/projects"
                        style={{
                            color: "var(--accent)",
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            whiteSpace: "nowrap",
                            transition: "color 0.18s ease",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = "var(--heading)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "var(--accent)")}
                    >
                        View all projects →
                    </Link>
                </div>

                <div className="project-grid">
                    {featured.map((project) => (
                        <article className="project-card" key={project.title} style={{ padding: "1.5rem" }}>
                            <p className="project-type">{project.type}</p>
                            <h3>{project.title}</h3>
                            {project.link && (
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="project-link"
                                >
                                    {project.linkLabel}
                                </a>
                            )}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}