import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NotFound from "../components/NotFound";
import ButtonLink from "../components/ui/ButtonLink";
import TextLink from "../components/ui/TextLink";
import TechChips from "../components/ui/TechChips";
import ProjectMedia from "../components/ProjectMedia";
import { findProject } from "../data/projects";
import type { DetailSection } from "../data/projects";

function Section({ section }: { section?: DetailSection }) {
    if (!section) {
        return null;
    }
    return (
        <section className="detail-section">
            <h2>{section.heading}</h2>
            <p>{section.text}</p>
        </section>
    );
}

export default function ProjectDetail() {
    const { slug } = useParams();
    const project = findProject(slug);

    if (!project) {
        return <NotFound />;
    }

    const hasLinks = Boolean(project.link) || Boolean(project.repo);

    return (
        <div className="site-shell">
            <Header />
            <main>
                <article className="section">
                    <div className="container">
                        <p className="project-type">{project.type}</p>
                        <h1 className="detail-title">{project.title}</h1>
                        <p className="detail-description">{project.description}</p>

                        <Section section={project.problem} />
                        <Section section={project.built} />
                        <Section section={project.role} />

                        {project.screenshot && (
                            <ProjectMedia
                                screenshot={project.screenshot}
                                sizes="(max-width: 1152px) 100vw, 1120px"
                                className="detail-media"
                            />
                        )}

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

                        <div className="page-end">
                            <ButtonLink to="/projects" variant="secondary">
                                View all projects
                            </ButtonLink>
                        </div>
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
}
