import { Link } from "react-router-dom";
import type { Project } from "../data/projects";
import TextLink from "./ui/TextLink";
import TechChips from "./ui/TechChips";

interface ProjectCardProps {
    project: Project;
    // homepage cards show the shorter summary; the Projects page shows the full description
    useSummary?: boolean;
    // h3 on the homepage (under the Projects h2), h2 on the Projects page (under its h1)
    headingLevel?: 2 | 3;
}

export default function ProjectCard({ project, useSummary = false, headingLevel = 3 }: ProjectCardProps) {
    let text = project.description;
    if (useSummary && project.summary) {
        text = project.summary;
    }

    // the title links to the project's detail page
    const titleLink = (
        <Link to={`/projects/${project.slug}`} className="project-title-link">
            {project.title}
        </Link>
    );
    let title = <h3 className="project-title">{titleLink}</h3>;
    if (headingLevel === 2) {
        title = <h2 className="project-title">{titleLink}</h2>;
    }

    const hasLinks = Boolean(project.link) || Boolean(project.repo);

    return (
        <article className="project-card">
            <p className="project-type">{project.type}</p>
            {title}
            <p className="project-description">{text}</p>
            <TechChips items={project.stack} />
            {hasLinks && (
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
    );
}
