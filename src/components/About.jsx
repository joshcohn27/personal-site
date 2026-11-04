export default function About() {
    return (
        <section id="about" className="section">
            <div className="container">
                <div className="section-heading">
                    <h2>Background and skills</h2>
                </div>

                <div className="about-stack">
                    <div className="text-block">
                        <h3>Background</h3>
                        <p>
                            I have a BS in Computing and Information Technologies from RIT with a
                            minor in Software Engineering. I've been coding since 2017.
                        </p>
                        <p>
                            At Discovery Machine, I built most of a cross-platform Air Force app in
                            Flutter. At Chameleon Consulting Group, I automated virtual machine setup
                            with Docker, worked on a Flask API, and set up GitLab pipelines.
                        </p>
                        <p>
                            I care about writing software that's clear, maintainable, and useful to
                            the people relying on it.
                        </p>
                    </div>

                    <div className="text-block">
                        <h3>Technical skills</h3>
                        <div className="skill-groups">
                            <div className="skill-group">
                                <h4>Languages</h4>
                                <ul className="skill-tags">
                                    <li>Python</li>
                                    <li>TypeScript</li>
                                    <li>JavaScript</li>
                                    <li>Java</li>
                                    <li>C#</li>
                                    <li>SQL</li>
                                </ul>
                            </div>
                            <div className="skill-group">
                                <h4>Frontend</h4>
                                <ul className="skill-tags">
                                    <li>React</li>
                                    <li>Angular</li>
                                    <li>Flutter</li>
                                    <li>HTML</li>
                                    <li>CSS</li>
                                </ul>
                            </div>
                            <div className="skill-group">
                                <h4>Backend</h4>
                                <ul className="skill-tags">
                                    <li>Node.js</li>
                                    <li>Flask</li>
                                    <li>FastAPI</li>
                                    <li>Spring Boot</li>
                                    <li>ASP.NET MVC</li>
                                    <li>REST APIs</li>
                                </ul>
                            </div>
                            <div className="skill-group">
                                <h4>Data and ML</h4>
                                <ul className="skill-tags">
                                    <li>NumPy</li>
                                    <li>scikit-learn</li>
                                    <li>Oracle</li>
                                </ul>
                            </div>
                            <div className="skill-group">
                                <h4>Tools</h4>
                                <ul className="skill-tags">
                                    <li>Git</li>
                                    <li>Docker</li>
                                    <li>GitLab CI/CD</li>
                                    <li>Azure</li>
                                    <li>Vercel</li>
                                    <li>Supabase</li>
                                    <li>Claude Code</li>
                                </ul>
                            </div>
                            <div className="skill-group">
                                <h4>Testing</h4>
                                <ul className="skill-tags">
                                    <li>Pytest</li>
                                    <li>JUnit</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}