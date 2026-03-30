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
                            I'm a software engineer finishing my BS in Computing and Information
                            Technologies at RIT in May 2026, with a minor in Software Engineering.
                            I've been coding since 2017, and over the past two years I've worked on
                            real engineering teams. At Discovery Machine, I built a cross-platform
                            mobile app in Flutter. At Chameleon Consulting Group (now Clarity), I
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
                        <h3>Stack</h3>
                        <ul className="bullet-list">
                            <li><strong>Languages:</strong> JavaScript/TypeScript, Python, Java, Go, C#, Dart</li>
                            <li><strong>Frontend:</strong> React, Angular, Flutter, HTML/CSS</li>
                            <li><strong>Backend:</strong> Spring Boot, Node.js, REST APIs</li>
                            <li><strong>Cloud/DevOps:</strong> AWS, Azure, Docker, Terraform, Git</li>
                            <li><strong>Other:</strong> SQL, OOP/design patterns, Agile delivery</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}