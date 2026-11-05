import { Link } from "react-router-dom";
import type { Project } from "../data/projects";
import TextLink from "./ui/TextLink";
import TechChips from "./ui/TechChips";
import ProjectMedia from "./ProjectMedia";

interface ProjectCardProps {
    project: Project;
    // homepage cards show the shorter summary; the Projects page shows the full description
    useSummary?: boolean;
    // h3 on the homepage (under the Projects h2), h2 on the Projects page (under its h1)
    headingLevel?: 2 | 3;
    // "stacked": screenshot on top (homepage). "row": screenshot beside the text (Projects page)
    layout?: "stacked" | "row";
}

export default function ProjectCard({ project, useSummary = false, headingLevel = 3, layout = "stacked" }: ProjectCardProps) {
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

    let sizes = "(max-width: 960px) 100vw, 364px";
    let cardClass = "project-card";
    if (layout === "row") {
        sizes = "(max-width: 720px) 100vw, 320px";
        cardClass = "project-card project-card-row";
    }
    if (!project.screenshot) {
        cardClass += " no-media";
    }

    return (
        <article className={cardClass}>
            {project.screenshot && (
                <ProjectMedia screenshot={project.screenshot} sizes={sizes} className="card-media" />
            )}
            <div className="project-card-body">
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
            </div>
        </article>
    );
}
