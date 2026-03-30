const projects = [
    {
        title: "Committed",
        type: "VS Code Extension",
        description:
            "A VS Code extension I built as part of a course project to improve commit workflows. I found myself rushing commits or writing messages that weren't useful later, so I focused on adding structure without slowing the process down. The biggest challenge was working with the VS Code extension API and integrating with Git in a clean way. It pushed me to think more about developer experience and how small tools can actually change habits.",
        stack: "VS Code Extension API, JavaScript, Git",
    },
    {
        title: "Personal Casino",
        type: "Interactive Web App",
        link: "https://joshbcohn.com/casino",
        description:
            "A browser-based casino I built for fun, focused on recreating real table games with accurate logic and a polished UI. I've always liked the strategy and mechanics behind these games, so this became a way to explore them without involving real money. The biggest challenge has been managing complex game state, animations, and edge cases while keeping the experience smooth. It's been my best project for pushing frontend architecture and building something that actually feels like a real product.",
        stack: "React, TypeScript, state management, game logic, UI/UX",
    },
    {
        title: "OD Scheduler",
        type: "Python Utility",
        description:
            "A scheduling tool I built for my summer camp where staff needed to be assigned on-duty (OD) days. Creating these schedules by hand would take hours and was hard to keep fair, so I wrote a program to automate it. The goal was to distribute shifts evenly while avoiding things like back-to-back assignments and days off. The challenge was turning fairness into logic that worked across all cases. What used to take hours could now be done in under a minute, which made a real difference for the team.",
        stack: "Python, algorithms, problem solving, scripting",
    },
    {
        title: "Beehive Monitoring System",
        type: "Full-Stack Capstone",
        description:
            "A team capstone project to collect and display beehive sensor data through a web interface. I led frontend architecture and helped coordinate work across the team. One of the biggest challenges was keeping things consistent while multiple people were building features at once. It taught me a lot about communication, structuring a frontend others can build on, and working like a real engineering team.",
        stack: "React, REST API, Agile, frontend architecture, team collaboration",
    },
];

export default function Projects() {
    return (
        <section id="projects" className="section section-alt">
            <div className="container">
                <div className="section-heading">
                    <p className="section-label">Projects</p>
                    <h2>Selected work.</h2>
                </div>

                <div className="project-grid">
                    {projects.map((project) => (
                        <article className="project-card" key={project.title}>
                            <p className="project-type">{project.type}</p>
                            <h3>{project.title}</h3>
                            <p className="project-description">{project.description}</p>

                            {project.link && (
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="project-link"
                                >
                                    View Live →
                                </a>
                            )}

                            <p className="project-stack">{project.stack}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}