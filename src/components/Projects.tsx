import ButtonLink from "./ui/ButtonLink";
import TextLink from "./ui/TextLink";
import TechChips from "./ui/TechChips";
import SectionHeader from "./ui/SectionHeader";

const featured = [
    {
        title: "Beehive Monitoring System",
        type: "Undergrad Senior Capstone",
        description:
            "A full-stack capstone project that turned physical hive sensor data into a React dashboard for monitoring inspections, observations, and hive conditions.",
        stack: ["React", "TypeScript", "Vite", "REST API"],
        link: "https://joshbcohn.com/projects/beehive",
        linkLabel: "View Demo",
        repo: "https://github.com/joshcohn27/beehive-frontend",
    },
    {
        title: "NHL Draft Lottery Simulator",
        type: "Interactive Web App",
        description:
            "An interactive simulator that models the NHL draft lottery, visualizes the ping-pong ball draw, and carries the final order directly into a mock draft workflow.",
        stack: ["React", "TypeScript", "REST API"],
        link: "https://hockeylotto.com",
        linkLabel: "Open Simulator",
        repo: "https://github.com/joshcohn27/nhl-lottery-sim",
    },
    {
        title: "OD Scheduler",
        type: "Interactive Web App",
        description:
            "A scheduling engine built for Camp Seneca Lake that generates fair nightly on-duty coverage for 20-30 staff, replacing a manual process that took hours every session.",
        stack: ["React", "TypeScript"],
        link: "https://scheduler.joshbcohn.com",
        linkLabel: "Open Scheduler",
        repo: "https://github.com/joshcohn27/od_new",
    },
];

export default function Projects() {
    return (
        <section id="projects" className="section">
            <div className="container">
                <SectionHeader
                    title="Projects"
                    subtitle="Selected work"
                    action={
                        <ButtonLink to="/projects" variant="secondary">
                            View all projects
                        </ButtonLink>
                    }
                />

                <div className="project-grid">
                    {featured.map((project) => (
                        <article className="project-card" key={project.title}>
                            <p className="project-type">{project.type}</p>
                            <h3>{project.title}</h3>
                            <p className="project-description">{project.description}</p>
                            <TechChips items={project.stack} />
                            <div className="project-links">
                                <TextLink href={project.link} newTab strong>
                                    {project.linkLabel}
                                </TextLink>
                                <TextLink href={project.repo} newTab strong>
                                    GitHub
                                </TextLink>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}