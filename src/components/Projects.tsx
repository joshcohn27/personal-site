const projects = [
    {
        title: "Committed",
        type: "VS Code Extension",
        description:
            "A developer productivity tool focused on improving commit workflows and making day-to-day version control more intentional and efficient.",
        stack: "VS Code API, JavaScript, GitHub, Extension Development",
    },
    {
        title: "Beehive Monitoring Capstone",
        type: "Full-Stack Team Project",
        description:
            "A capstone project centered on monitoring and surfacing meaningful beehive data through a usable, responsive interface and structured engineering process.",
        stack: "React, frontend architecture, team collaboration, product design",
    },
    {
        title: "FundGoodDeeds App",
        type: "Java MVC Application",
        description:
            "A software engineering project using MVC and design patterns to manage needs, funding sources, and logs with a maintainable project structure.",
        stack: "Java, Swing, MVC, CSV persistence, Composite pattern",
    },
    {
        title: "Personal Site",
        type: "Frontend Engineering",
        description:
            "This site itself is a project: designed to communicate technical ability, product judgment, visual restraint, and a clear professional identity.",
        stack: "React, CSS, responsive design, information architecture",
    },
];

export default function Projects() {
    return (
        <section id="projects" className="section section-alt">
            <div className="container">
                <div className="section-heading">
                    <p className="section-label">Projects</p>
                    <h2>Selected work that reflects how I think and build.</h2>
                </div>

                <div className="project-grid">
                    {projects.map((project) => (
                        <article className="project-card" key={project.title}>
                            <p className="project-type">{project.type}</p>
                            <h3>{project.title}</h3>
                            <p className="project-description">{project.description}</p>
                            <p className="project-stack">{project.stack}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}