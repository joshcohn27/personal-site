import Header from "../components/Header";
import Footer from "../components/Footer";
import ButtonLink from "../components/ui/ButtonLink";
import ProjectCard from "../components/ProjectCard";
import { projects } from "../data/projects";

export default function ProjectsPage() {
    return (
        <div className="site-shell">
            <Header />
            <main>
                <section className="section">
                    <div className="container">
                        <div className="section-heading" style={{ marginBottom: "var(--space-5)" }}>
                            <h1>Projects</h1>
                            <p className="page-intro">
                                A mix of work projects, personal tools, and things I built because no one else had.
                            </p>
                        </div>

                        <div className="project-list">
                            {projects.map((project) => (
                                <ProjectCard key={project.slug} project={project} headingLevel={2} layout="row" />
                            ))}
                        </div>

                        <div className="page-end">
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