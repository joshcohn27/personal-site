export default function About() {
    return (
        <section id="about" className="section">
            <div className="container">
                <div className="section-heading">
                    <p className="section-label">About</p>
                    <h2>Background and what I work with.</h2>
                </div>

                <div className="about-grid">
                    <div className="content-card">
                        <p>
                            I'm a software engineer with a BS in Computing and Information
                            Technologies from RIT and a minor in Software Engineering.
                            I've been coding since 2017, and I've worked on real engineering
                            teams along the way. At Discovery Machine, I built a cross-platform
                            mobile app in Flutter. At Chameleon Consulting Group LLC, I
                            worked on cloud deployments and backend automation.
                        </p>
                        <p>
                            I've built a range of projects both on my own and through school,
                            including a VS Code extension to improve commit workflows, a full-stack
                            financial platform with Spring Boot and Angular, and a beehive monitoring
                            system. I care about writing software that is clear, maintainable, and
                            actually useful to the people relying on it.
                        </p>
                    </div>

                    <div className="content-card">
                        <h3>Technical Skills</h3>
                        <ul className="bullet-list">
                            <li><strong>Languages:</strong> JavaScript/TypeScript, Python, Java, Go, C#, Dart</li>
                            <li><strong>Frontend:</strong> React, Angular, Flutter, Vite, HTML/CSS</li>
                            <li><strong>Backend:</strong> Spring Boot, Node.js, Supabase, REST APIs</li>
                            <li><strong>ML:</strong> PyTorch, scikit-learn</li>
                            <li><strong>Databases:</strong> SQL, Oracle, ODBC/JDBC</li>
                            <li><strong>Cloud/DevOps:</strong> AWS, Azure, Docker, Terraform, Bash, Git</li>
                            <li><strong>Testing:</strong> JUnit, Pytest</li>
                            <li><strong>Other:</strong> OOP/design patterns, Agile Methodologies, MVC frameworks, AI-assisted development (Claude Code)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}