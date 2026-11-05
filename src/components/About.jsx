import SectionHeader from "./ui/SectionHeader";
import Values from "./Values";
import Interests from "./Interests";

export default function About() {
    return (
        <section id="about" className="section">
            <div className="container">
                <SectionHeader title="About" subtitle="A bit about me" />

                <div className="about-stack">
                    <div className="text-block full-width-text">
                        <h3>Background</h3>
                        <ol className="timeline">
                            <li className="timeline-stop">
                                <div className="timeline-head">
                                    <h4>High school</h4>
                                    <p className="timeline-date">Graduated 2021</p>
                                </div>
                                <span className="timeline-dot" aria-hidden="true"></span>
                                <div className="timeline-text">
                                    <p>
                                        I started coding in high school. My school offered programming classes all
                                        four years, which I was lucky to have, and I took every one. They were all
                                        taught by the same teacher, and he believed in my ability to solve problems.
                                    </p>
                                </div>
                            </li>
                            <li className="timeline-stop">
                                <div className="timeline-head">
                                    <h4>RIT</h4>
                                    <p className="timeline-date">Aug 2021 – May 2026</p>
                                </div>
                                <span className="timeline-dot" aria-hidden="true"></span>
                                <div className="timeline-text">
                                    <p>
                                        I learned Java and Python there and kept going. I got my BS in Computing and
                                        Information Technologies from RIT with a minor in Software Engineering.
                                    </p>
                                </div>
                            </li>
                            <li className="timeline-stop">
                                <div className="timeline-head">
                                    <h4>Internships</h4>
                                    <p className="timeline-date">Aug–Dec 2023 · Aug–Dec 2024</p>
                                </div>
                                <span className="timeline-dot" aria-hidden="true"></span>
                                <div className="timeline-text">
                                    <p>
                                        My internships at Discovery Machine, Inc. and Chameleon Consulting Group LLC let me
                                        keep learning while putting my skills to work on real teams. They taught me
                                        things you can only learn on the job.
                                    </p>
                                </div>
                            </li>
                            <li className="timeline-stop">
                                <div className="timeline-head">
                                    <h4>Drexel</h4>
                                    <p className="timeline-date">Sep 2026 – Jun 2028 (expected)</p>
                                </div>
                                <span className="timeline-dot" aria-hidden="true"></span>
                            </li>
                        </ol>

                        <p>
                            What keeps me going is that there's always something new to learn, big or
                            small. I love solving problems, especially when I get to find a different
                            way to solve them.
                        </p>
                        <p>
                            I care about writing software that's clear, maintainable, and useful to the
                            people relying on it.
                        </p>
                    </div>

                    <div className="text-block">
                        <h3>Skills</h3>
                        <div className="skill-groups">
                            <div className="skill-group">
                                <h4>Languages</h4>
                                <ul className="skill-tags">
                                    <li>Python</li>
                                    <li>TypeScript</li>
                                    <li>JavaScript</li>
                                    <li>Java</li>
                                    <li>C#</li>
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
                                    <li>REST API</li>
                                </ul>
                            </div>
                            <div className="skill-group">
                                <h4>Databases</h4>
                                <ul className="skill-tags">
                                    <li>SQL</li>
                                    <li>Oracle</li>
                                    <li>Supabase</li>
                                </ul>
                            </div>
                            <div className="skill-group">
                                <h4>Data and ML</h4>
                                <ul className="skill-tags">
                                    <li>NumPy</li>
                                    <li>scikit-learn</li>
                                </ul>
                            </div>
                            <div className="skill-group">
                                <h4>Tools</h4>
                                <ul className="skill-tags">
                                    <li>Git</li>
                                    <li>Docker</li>
                                    <li>GitLab Pipelines</li>
                                    <li>Azure</li>
                                    <li>Vercel</li>
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

                    <Values />
                    <Interests />
                </div>
            </div>
        </section>
    );
}