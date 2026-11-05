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
                        <p>
                            I started coding in high school. My school offered programming classes all
                            four years, which I was lucky to have, and I took every one. They were all
                            taught by the same teacher, and he believed in my ability to solve problems.
                        </p>
                        <p>
                            I learned Java and Python there and kept going. I got my BS in Computing and
                            Information Technologies from RIT with a minor in Software Engineering.
                        </p>
                        <p>
                            My internships at Discovery Machine and Chameleon Consulting Group let me
                            keep learning while putting my skills to work on real teams. They taught me
                            things you can only learn on the job.
                        </p>
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

                    <Values />
                    <Interests />
                </div>
            </div>
        </section>
    );
}