import { featuredProjects } from "../data/projects";
import ButtonLink from "./ui/ButtonLink";
import SectionHeader from "./ui/SectionHeader";
import ProjectCard from "./ProjectCard";

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
                    {featuredProjects.map((project) => (
                        <ProjectCard key={project.slug} project={project} useSummary />
                    ))}
                </div>
            </div>
        </section>
    );
}
